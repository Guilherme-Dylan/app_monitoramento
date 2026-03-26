import { Lock, Shield } from "lucide-react";

export function SecurityInfoCard() {
  return (
    <section className="security-card">
      <div className="security-icon-wrap">
        <Shield className="h-12 w-12 text-[var(--brand-blue)]" />
        <Lock className="h-5 w-5 text-[var(--brand-blue)] absolute" />
      </div>
      <div className="hidden md:block security-divider" />
      <div>
        <h3 className="text-2xl md:text-[2.05rem] leading-tight font-extrabold text-[var(--brand-blue-deep)] mb-3">
          Segurança e confidencialidade
        </h3>
        <p className="text-[0.98rem] md:text-[1.02rem] text-[var(--text-main)] leading-relaxed">
          Todas as informações são tratadas com sigilo. As denúncias anônimas não coletam dados de identificação pessoal e seguem boas práticas de segurança da informação.
        </p>
      </div>
    </section>
  );
}
