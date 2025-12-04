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
