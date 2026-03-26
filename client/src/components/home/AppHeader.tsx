import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LayoutGrid, LogOut, Shield } from "lucide-react";

type AppHeaderProps = {
  isAuthenticated: boolean;
  userName?: string | null;
  onLogout: () => Promise<void>;
};

export function AppHeader({ isAuthenticated, userName, onLogout }: AppHeaderProps) {
  return (
    <header className="theme-header">
      <div className="theme-container flex items-center justify-between py-4">
        <Link href="/menu" className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-[var(--brand-blue)]" />
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--brand-blue-deep)]">
            Monitoramento
          </span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[var(--text-soft)]">Bem-vindo,</p>
              <p className="font-semibold text-[var(--brand-blue-deep)]">{userName}</p>
            </div>
            <Button variant="outline" className="rounded-2xl h-11 px-5" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        ) : (
          <Button asChild className="btn-premium btn-premium-blue h-11 px-6 text-base">
            <Link href="/menu" className="inline-flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              Menu
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
