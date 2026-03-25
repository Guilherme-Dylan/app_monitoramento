import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { VisitScheduleForm } from "@/components/VisitScheduleForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, XCircle, Calendar, FileText, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function UserDashboard() {
  const { user } = useAuth();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const { data: requests, isLoading } = trpc.searchRequests.getUserRequests.useQuery();
  const { data: visits = [], isLoading: visitsLoading, refetch: refetchVisits } = trpc.visits.getUserVisits.useQuery();

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
      case "completed":
        return (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Concluida
          </div>
        );
      case "pending":
      default:
        return (
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pendente
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Bem-vindo, {user?.nome}!</h1>
          <p className="text-slate-600">Acompanhe suas solicitações de busca e agendamentos de visita</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Minhas Solicitações</h2>
              {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
              ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {request.department}
                      </h3>
                      <p className="text-slate-600 mb-3 line-clamp-2">{request.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        <span>📧 {request.email}</span>
                        {request.phone && <span>📱 {request.phone}</span>}
                        {request.position && <span>💼 {request.position}</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-3">
                        Enviado em {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
              ) : (
                <Card className="border-slate-200">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="text-slate-400 mb-4">
                      <div className="text-5xl mb-4">📋</div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma solicitação encontrada</h3>
                    <p className="text-slate-600 mb-6">
                      Você ainda não fez nenhuma solicitação de busca.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Visitas Agendadas</h2>
              {visitsLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-slate-600">Carregando visitas...</p>
                  </CardContent>
                </Card>
              ) : visits.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-slate-600">Você ainda não agendou nenhuma visita</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <Card key={visit.id} className="border-slate-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">Visita Agendada</h3>
                            <p className="text-sm text-slate-600">
                              {new Date(visit.scheduledDate).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                              <Clock className="w-4 h-4" />
                              {new Date(visit.scheduledDate).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            {visit.reason && (
                              <div className="flex items-start gap-2 text-sm text-slate-700 mt-2">
                                <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p className="line-clamp-2">{visit.reason}</p>
                              </div>
                            )}
                            {visit.adminNotes && (
                              <div className="mt-3 p-3 bg-slate-100 rounded text-sm text-slate-700">
                                <p className="font-medium mb-1">Notas do Administrador:</p>
                                <p>{visit.adminNotes}</p>
                              </div>
                            )}
                            <div className="mt-3">
                              {getStatusBadge(visit.status)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedRequestId ? (
              <VisitScheduleForm
                requestId={selectedRequestId}
                onSuccess={() => {
                  setSelectedRequestId(null);
                  refetchVisits();
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Agendar Visita</CardTitle>
                  <CardDescription>
                    Selecione uma solicitação aprovada para agendar uma visita
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Clique no botão "Agendar Visita" em uma de suas solicitações aprovadas para começar.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
