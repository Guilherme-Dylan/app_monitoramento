import { useAuth } from "@/_core/hooks/useAuth";
import { AppHeader } from "@/components/home/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Eye, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/login",
  });
  const [activeTab, setActiveTab] = useState<"requests" | "reports">("requests");

  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } =
    trpc.searchRequests.getAllRequests.useQuery(undefined, {
      enabled: user?.tipo_de_user === "admin",
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    });
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } =
    trpc.anonymousReports.getAllReports.useQuery(undefined, {
      enabled: user?.tipo_de_user === "admin",
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    });

  const updateRequestStatusMutation = trpc.searchRequests.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetchRequests();
    },
    onError: error => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const updateReportStatusMutation = trpc.anonymousReports.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetchReports();
    },
    onError: error => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="status-pill status-pill-approved">
            <CheckCircle className="w-4 h-4" />
            Aprovado
          </div>
        );
      case "rejected":
        return (
          <div className="status-pill status-pill-rejected">
            <XCircle className="w-4 h-4" />
            Rejeitado
          </div>
        );
      case "pending":
        return (
          <div className="status-pill status-pill-pending">
            <Clock className="w-4 h-4" />
            Pendente
          </div>
        );
      case "under_review":
        return (
          <div className="status-pill status-pill-under-review">
            <Eye className="w-4 h-4" />
            Em análise
          </div>
        );
      case "resolved":
        return (
          <div className="status-pill status-pill-resolved">
            <CheckCircle className="w-4 h-4" />
            Resolvido
          </div>
        );
      case "closed":
        return (
          <div className="status-pill status-pill-closed">
            <XCircle className="w-4 h-4" />
            Fechado
          </div>
        );
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="theme-page min-h-screen">
        <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />
        <main className="theme-container theme-main flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-blue)]"></div>
        </main>
      </div>
    );
  }

  if (user?.tipo_de_user !== "admin") {
    return (
      <div className="theme-page min-h-screen">
        <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />
        <main className="theme-container theme-main">
          <div className="max-w-4xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-800 font-medium">
                  Acesso negado. Apenas administradores podem acessar esta página.
                </p>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao menu
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />

      <main className="theme-container theme-main">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="theme-hero-title mb-2">Painel administrativo</h1>
            <p className="theme-hero-subtitle">Gerencie solicitações e denúncias do sistema.</p>
          </div>

          <div className="flex gap-4 mb-6 border-b border-[var(--brand-blue-soft)]">
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "requests"
                  ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
                  : "border-transparent text-[var(--text-soft)] hover:text-[var(--brand-blue-deep)]"
              }`}
            >
              Solicitações de busca ({requests?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "reports"
                  ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
                  : "border-transparent text-[var(--text-soft)] hover:text-[var(--brand-blue-deep)]"
              }`}
            >
              Denúncias anônimas ({reports?.length || 0})
            </button>
          </div>

          {activeTab === "requests" && (
            <div>
              {requestsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : requests && requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map(request => (
                    <Card key={request.id} className="theme-surface-card bg-white/95">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Nome</p>
                            <p className="text-sm font-medium text-[var(--brand-blue-deep)]">{request.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                            <p className="text-sm text-slate-700">{request.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Setor</p>
                            <p className="text-sm text-slate-700">{request.department}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Descrição</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{request.description}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatusMutation.mutate({ id: request.id, status: "approved" })}
                            disabled={updateRequestStatusMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatusMutation.mutate({ id: request.id, status: "rejected" })}
                            disabled={updateRequestStatusMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRequestStatusMutation.mutate({ id: request.id, status: "pending" })}
                            disabled={updateRequestStatusMutation.isPending}
                          >
                            Pendente
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          Enviado em {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="theme-surface-card">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-slate-600">Nenhuma solicitação encontrada</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              {reportsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map(report => (
                    <Card key={report.id} className="theme-surface-card bg-white/95">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Título</p>
                            <p className="text-sm font-medium text-[var(--brand-blue-deep)]">{report.title}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Categoria</p>
                            <p className="text-sm text-slate-700">{report.category || "Sem categoria"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Descrição</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{report.description}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "under_review" })}
                            disabled={updateReportStatusMutation.isPending}
                            className="btn-premium btn-premium-blue text-white"
                          >
                            Em análise
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "resolved" })}
                            disabled={updateReportStatusMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Resolvido
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "closed" })}
                            disabled={updateReportStatusMutation.isPending}
                            className="bg-slate-600 hover:bg-slate-700 text-white"
                          >
                            Fechar
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                          Enviado em {format(new Date(report.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="theme-surface-card">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-slate-600">Nenhuma denúncia encontrada</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao menu
              </Link>
            </Button>
            <Button asChild className="btn-premium btn-premium-blue">
              <Link href="/reports">Abrir relatórios</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
