import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, UserCircle2 } from "lucide-react";
import { Link } from "wouter";

export function LoginAccessCard() {
  return (
    <article className="premium-card premium-card-blue h-full flex flex-col">
      <div className="flex items-start gap-5">
        <div className="icon-box icon-box-blue">
          <UserCircle2 className="h-14 w-14 text-white" />
        </div>

        <h2 className="text-2xl md:text-[2.05rem] leading-tight font-extrabold text-[var(--brand-blue-deep)]">
          Acesse sua conta para utilizar todos os recursos
        </h2>
      </div>

      <div className="divider-blue mt-5 mb-4" />

      <p className="text-base md:text-[1.03rem] text-[var(--text-main)] leading-relaxed mb-5">
        Ao fazer login, você poderá acompanhar solicitações, consultar registros e acessar funcionalidades exclusivas do sistema.
      </p>

      <Button asChild className="btn-premium btn-premium-black w-full h-12 text-lg md:text-[1.35rem] mt-auto">
        <Link href="/login" className="inline-flex items-center justify-center gap-3">
          <LogIn className="h-5 w-5" />
          Entrar no sistema
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </article>
  );
}
