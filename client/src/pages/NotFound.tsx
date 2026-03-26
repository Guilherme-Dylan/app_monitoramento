import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/home/AppHeader";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={false} onLogout={async () => {}} />
      <main className="theme-container theme-main w-full flex items-center justify-center">
        <Card className="w-full max-w-lg mx-4 theme-surface-card bg-white/95">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
                <AlertCircle className="relative h-16 w-16 text-red-500" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[var(--brand-blue-deep)] mb-2">404</h1>

            <h2 className="text-xl font-semibold text-[var(--text-main)] mb-4">
              Página não encontrada
            </h2>

            <p className="text-[var(--text-soft)] mb-8 leading-relaxed">
              A página que você está procurando não existe ou foi movida.
            </p>

            <div id="not-found-button-group" className="flex justify-center">
              <Button
                onClick={handleGoHome}
                className="btn-premium btn-premium-blue px-6 py-2.5 rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para o início
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
