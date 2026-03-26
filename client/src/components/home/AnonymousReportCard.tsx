import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Lock, Megaphone } from "lucide-react";
import { Link } from "wouter";

export function AnonymousReportCard() {
  return (
    <article className="premium-card premium-card-red h-full flex flex-col">
      <div className="flex items-start gap-5">
        <div className="icon-box icon-box-red">
          <AlertCircle className="h-14 w-14 text-white" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl md:text-[2.05rem] leading-tight font-extrabold text-[var(--brand-blue-deep)] mb-3">
            Denúncia Anônima
          </h2>
          <div className="badge-red">
            <Lock className="h-4 w-4" />
            Total sigilo e proteção garantida
          </div>
        </div>
      </div>

      <div className="divider-red mt-5 mb-4" />

      <p className="text-base md:text-[1.03rem] text-[var(--text-main)] leading-relaxed mb-5">
        Registre uma ocorrência com <strong>total sigilo e segurança</strong>. Sua identidade permanece protegida durante todo o processo.
      </p>

      <Button asChild className="btn-premium btn-premium-red w-full h-12 text-lg md:text-[1.35rem] mt-auto">
        <Link href="/anonymous-report" className="inline-flex items-center justify-center gap-3">
          <Megaphone className="h-5 w-5" />
          Registrar denúncia
          <ArrowRight className="h-5 w-5" />
        </Link>
      </Button>
    </article>
  );
}
