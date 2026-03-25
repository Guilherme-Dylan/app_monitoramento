import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Eye, Download, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"requests" | "reports" | "visits">("requests");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } = 
    trpc.searchRequests.getAllRequests.useQuery();
  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = 
    trpc.anonymousReports.getAllReports.useQuery();
  const { data: visits, isLoading: visitsLoading, refetch: refetchVisits } = 
    trpc.visits.getAll.useQuery();

  const updateRequestStatusMutation = trpc.searchRequests.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetchRequests();
      setSelectedRequest(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const updateReportStatusMutation = trpc.anonymousReports.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetchReports();
      setSelectedReport(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const updateVisitStatusMutation = trpc.visits.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status da visita atualizado com sucesso!");
      refetchVisits();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status da visita");
    },
  });

  if (user?.tipo_de_user !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 font-medium">
                Acesso negado. Apenas administradores podem acessar esta página.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Aprovado
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rejeitado
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pendente
          </div>
        );
      case "under_review":
        return (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <Eye className="w-4 h-4" />
            Em Análise
          </div>
        );
      case "resolved":
        return (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Resolvido
          </div>
        );
      case "closed":
        return (
          <div className="flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Fechado
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Concluída
          </div>
        );
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Painel Administrativo</h1>
          <p className="text-slate-600">Gerencie solicitações, denúncias e visitas do sistema</p>
        </div>

        {/* Abas */}
        <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Solicitações de Busca ({requests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "reports"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Denúncias Anônimas ({reports?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("visits")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "visits"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Visitas Agendadas ({visits?.length || 0})
          </button>
        </div>

        {/* Solicitações */}
        {activeTab === "requests" && (
          <div>
            {requestsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : requests && requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id} className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Nome</p>
                          <p className="text-sm font-medium text-slate-900">{request.name}</p>
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
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{request.description}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => updateRequestStatusMutation.mutate({ id: request.id, status: "approved" })}
                          disabled={updateRequestStatusMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-slate-500">Nenhuma solicitação encontrada</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Visitas */}
        {activeTab === "visits" && (
          <div>
            {visitsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : visits && visits.length > 0 ? (
              <div className="space-y-4">
                {visits.map((visit: any) => (
                  <Card key={visit.id} className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Usuário</p>
                          <p className="text-sm font-medium text-slate-900">{visit.userName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Data</p>
                          <p className="text-sm text-slate-700">{visit.visitDate ? format(new Date(visit.visitDate), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "Data não definida"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Local</p>
                          <p className="text-sm text-slate-700">{visit.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                          {getStatusBadge(visit.status)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Observações</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{visit.notes || "Sem observações"}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => updateVisitStatusMutation.mutate({ visitId: visit.id, status: "approved" })}
                          disabled={updateVisitStatusMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateVisitStatusMutation.mutate({ visitId: visit.id, status: "rejected" })}
                          disabled={updateVisitStatusMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateVisitStatusMutation.mutate({ visitId: visit.id, status: "completed" })}
                          disabled={updateVisitStatusMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Concluída
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-slate-500">Nenhuma visita agendada</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Denúncias */}
        {activeTab === "reports" && (
          <div>
            {reportsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="border-slate-200">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Categoria</p>
                          <p className="text-sm font-medium text-slate-900">{report.category || "Geral"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Data</p>
                          <p className="text-sm text-slate-700">{format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Descrição</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{report.description}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "under_review" })}
                          disabled={updateReportStatusMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Em Análise
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "resolved" })}
                          disabled={updateReportStatusMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Resolvido
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateReportStatusMutation.mutate({ id: report.id, status: "closed" })}
                          disabled={updateReportStatusMutation.isPending}
                          className="bg-slate-600 hover:bg-slate-700 text-white"
                        >
                          Fechado
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-slate-200">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-slate-500">Nenhuma denúncia encontrada</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
