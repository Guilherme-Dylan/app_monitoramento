import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createSearchRequest,
  getAllSearchRequests,
  getUserSearchRequests,
  updateSearchRequestStatus,
  createAnonymousReport,
  getAllAnonymousReports,
  updateAnonymousReportStatus,
} from "./db";
import { generateReportHTML } from "./reports";
import { validateCredentials, createUserWithPassword } from "./auth-local";
import { sdk } from "./_core/sdk";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    loginLocal: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email inválido"),
          password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await validateCredentials(input.email, input.password);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email ou senha incorretos",
          });
        }
        
        // Criar token de sessão
        const sessionToken = await sdk.createSessionToken(user.openId || "", {
          name: user.name || "",
        });
        
        // Definir cookie de sessão
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
        
        return {
          success: true,
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
      }),
    registerLocal: publicProcedure
      .input(
        z.object({
          email: z.string().email("Email inválido"),
          password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
          name: z.string().min(1, "Nome é obrigatório"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Criar usuário
          const newUser = await createUserWithPassword(input.email, input.password, input.name, "user");
          console.log("[Register] Novo usuário criado:", newUser.email);
          
          // Fazer login automaticamente após registro
          const user = await validateCredentials(input.email, input.password);
          if (!user) {
            console.warn("[Register] Falha ao validar credenciais após registro:", input.email);
            throw new Error("Falha ao validar credenciais após registro");
          }
          
          console.log("[Register] Credenciais validadas, criando sessão para:", user.email);
          
          const sessionToken = await sdk.createSessionToken(user.openId || "", {
            name: user.name || "",
          });
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
          
          console.log("[Register] Sessão criada com sucesso para:", user.email);
          return { success: true };
        } catch (error) {
          console.error("[Register] Erro durante registro:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error instanceof Error ? error.message : "Erro ao criar usuário",
          });
        }
      }),
  }),

  // Procedimentos para solicitações de busca
  searchRequests: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
          phone: z.string().optional(),
          department: z.string().min(1, "Setor é obrigatório"),
          position: z.string().optional(),
          description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await createSearchRequest({
          userId: ctx.user.id,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          department: input.department,
          position: input.position || null,
          description: input.description,
          status: "pending",
        });
        return { success: true };
      }),

    getUserRequests: protectedProcedure.query(async ({ ctx }) => {
      return getUserSearchRequests(ctx.user.id);
    }),

    getAllRequests: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
      })
      .query(async () => {
        return getAllSearchRequests();
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
        })
      )
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
      })
      .mutation(async ({ input }) => {
        await updateSearchRequestStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Procedimentos para relatórios
  reports: router({
    generateHTML: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
      })
      .query(async () => {
        const html = await generateReportHTML();
        return { html };
      }),
  }),

  // Procedimentos para denúncias anônimas
  anonymousReports: router({
    create: publicProcedure
      .input(
        z.object({
          title: z.string().min(1, "Título é obrigatório"),
          description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createAnonymousReport({
          title: input.title,
          description: input.description,
          category: input.category || null,
          status: "pending",
        });
        return { success: true };
      }),

    getAllReports: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
      })
      .query(async () => {
        return getAllAnonymousReports();
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "under_review", "resolved", "closed"]),
        })
      )
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return next({ ctx });
      })
      .mutation(async ({ input }) => {
        await updateAnonymousReportStatus(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
