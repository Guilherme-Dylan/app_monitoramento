import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Removido getLoginUrl - usando apenas autenticação local
import { Link } from "wouter";
import { Shield, FileText, AlertCircle, BarChart3, LogOut } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Monitoramento</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm">
                  <p className="text-slate-600">Bem-vindo,</p>
                  <p className="font-semibold text-slate-900">{user?.nome}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Sistema de Monitoramento Empresarial
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Plataforma segura para solicitações de busca e denúncias anônimas
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Feature 1: Solicitação de Busca */}
          {isAuthenticated && (
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Solicitação de Busca
                </CardTitle>
                <CardDescription>
                  Envie uma solicitação formal de busca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Preencha um formulário com seus dados pessoais e setor de trabalho para fazer uma solicitação de busca que será analisada pela equipe.
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/search-request">Fazer Solicitação</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feature 2: Denúncia Anônima */}
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Denúncia Anônima
              </CardTitle>
              <CardDescription>
                Faça uma denúncia de forma segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Denuncie problemas de forma totalmente anônima. Sua identidade está completamente protegida.
              </p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Link href="/anonymous-report">Fazer Denúncia</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature 3: Meu Dashboard */}
          {isAuthenticated && (
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Meu Dashboard
                </CardTitle>
                <CardDescription>
                  Acompanhe suas solicitações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Veja o histórico de suas solicitações e acompanhe o status de cada uma em tempo real.
                </p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Link href="/user-dashboard">Ver Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feature 4: Painel Admin */}
          {isAuthenticated && user?.tipo_de_user === "admin" && (
            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Painel Administrativo
                </CardTitle>
                <CardDescription>
                  Gerencie solicitações e denúncias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Acesso exclusivo para administradores. Gerencie todas as solicitações e denúncias do sistema.
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/admin-dashboard">Ir para Admin</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feature 5: Relatórios */}
          {isAuthenticated && user?.tipo_de_user === "admin" && (
            <Card className="border-slate-200 hover:shadow-lg transition-shadow bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Relatórios
                </CardTitle>
                <CardDescription>
                  Gere relatórios em PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Gere e baixe relatórios completos com todas as solicitações e denúncias do sistema.
                </p>
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <Link href="/reports">Gerar Relatório</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Section */}
        {!isAuthenticated && (
          <Card className="border-blue-200 bg-blue-50 mb-12">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Faça login para acessar mais funcionalidades</h3>
              <p className="text-blue-800 mb-4">
                Ao fazer login, você terá acesso a solicitações de busca e poderá acompanhar o status de suas solicitações em tempo real.
              </p>
              <div className="flex gap-2">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/login">Fazer Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="bg-slate-100 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Segurança e Privacidade</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Todas as informações são tratadas com sigilo. As denúncias anônimas não coletam dados de identificação pessoal. 
            Seus dados estão protegidos e seguem as melhores práticas de segurança da indústria.
          </p>
        </div>
      </main>
    </div>
  );
}
