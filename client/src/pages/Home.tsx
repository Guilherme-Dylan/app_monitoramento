import { useAuth } from "@/_core/hooks/useAuth";
import { AnonymousReportCard } from "@/components/home/AnonymousReportCard";
import { AppHeader } from "@/components/home/AppHeader";
import { HeroSection } from "@/components/home/HeroSection";
import { LoginAccessCard } from "@/components/home/LoginAccessCard";
import { SecurityInfoCard } from "@/components/home/SecurityInfoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BarChart3, FileText, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="theme-page min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />

      <main className="theme-container theme-main">
        <HeroSection />

        {!isAuthenticated ? (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6 mb-7">
              <AnonymousReportCard />
              <LoginAccessCard />
            </section>
            <SecurityInfoCard />
          </>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="theme-surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--brand-blue)]" />
                  Solicitação de Busca
                </CardTitle>
                <CardDescription>Envie uma solicitação formal de busca</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="btn-premium btn-premium-blue w-full">
                  <Link href="/search-request">Fazer Solicitação</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="theme-surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[var(--brand-red)]" />
                  Denúncia Anônima
                </CardTitle>
                <CardDescription>Faça uma denúncia de forma segura</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="btn-premium btn-premium-red w-full">
                  <Link href="/anonymous-report">Fazer Denúncia</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="theme-surface-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Meu Dashboard
                </CardTitle>
                <CardDescription>Acompanhe suas solicitações</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="btn-premium bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                  <Link href="/user-dashboard">Ver Dashboard</Link>
                </Button>
              </CardContent>
            </Card>

            {user?.tipo_de_user === "admin" && (
              <Card className="theme-surface-card border-violet-200 bg-violet-50/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-700" />
                    Painel Administrativo
                  </CardTitle>
                  <CardDescription>Gerencie solicitações e denúncias</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="btn-premium bg-violet-600 hover:bg-violet-700 text-white w-full">
                    <Link href="/admin-dashboard">Ir para Admin</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
