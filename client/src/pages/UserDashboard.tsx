import { useAuth } from "@/_core/hooks/useAuth";
import { VisitScheduleForm } from "@/components/VisitScheduleForm";
import { AppHeader } from "@/components/home/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, CheckCircle, Clock, Home, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function UserDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [scheduleForRequestId, setScheduleForRequestId] = useState<number | null>(null);
  const { data: requests, isLoading } = trpc.searchRequests.getUserRequests.useQuery();
  const { data: visits, isLoading: visitsLoading, refetch: refetchVisits } = trpc.visits.getUserVisits.useQuery();

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
      case "completed":
        return (
          <div className="status-pill status-pill-resolved">
            <CheckCircle className="w-4 h-4" />
            Concluído
          </div>
        );
      case "pending":
      default:
        return (
          <div className="status-pill status-pill-pending">
            <Clock className="w-4 h-4" />
            Pendente
          </div>
        );
    }
  };

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />

      <main className="theme-container theme-main">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="theme-hero-title mb-2">Meu dashboard</h1>
            <p className="theme-hero-subtitle">
              Bem-vindo, {user?.nome}. Acompanhe o histórico das suas solicitações.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="theme-surface-card bg-white/95">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--brand-blue-deep)] mb-2">
                          {request.department}
                        </h3>
                        <p className="text-[var(--text-main)] mb-3 line-clamp-2">{request.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
                          <span>📧 {request.email}</span>
                          {request.phone && <span>📱 {request.phone}</span>}
                          {request.position && <span>💼 {request.position}</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          Enviado em {format(new Date(request.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="btn-premium btn-premium-blue"
                        onClick={() =>
                          setScheduleForRequestId(prev => (prev === request.id ? null : request.id))
                        }
                      >
                        {scheduleForRequestId === request.id ? "Fechar agendamento" : "Agendar visita"}
                      </Button>
                    </div>
                    {scheduleForRequestId === request.id ? (
                      <div className="mt-4">
                        <VisitScheduleForm
                          requestId={request.id}
                          onSuccess={() => {
                            setScheduleForRequestId(null);
                            refetchVisits();
                          }}
                        />
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="theme-surface-card">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="text-slate-400 mb-4">
                  <div className="text-5xl mb-4">📋</div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--brand-blue-deep)] mb-2">Nenhuma solicitação encontrada</h3>
                <p className="text-[var(--text-main)] mb-6">
                  Você ainda não fez nenhuma solicitação de busca.
                </p>
                <Button asChild className="btn-premium btn-premium-blue">
                  <Link href="/search-request">Fazer uma solicitação</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-[var(--brand-blue-deep)] mb-4">Minhas visitas agendadas</h2>
            {visitsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : visits && visits.length > 0 ? (
              <div className="space-y-3">
                {visits.map(visit => (
                  <Card key={visit.id} className="theme-surface-card bg-white/95">
                    <CardContent className="pt-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[var(--brand-blue-deep)] flex items-center gap-2">
                            <CalendarClock className="h-4 w-4" />
                            Solicitação #{visit.requestId}
                          </p>
                          <p className="text-sm text-[var(--text-main)] mt-1">
                            {format(new Date(visit.scheduledDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                          <p className="text-xs text-[var(--text-soft)] mt-1">
                            {visit.reason || "Sem motivo informado"}
                          </p>
                        </div>
                        <div>{getStatusBadge(visit.status)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="theme-surface-card">
                <CardContent className="pt-8 pb-8 text-center text-[var(--text-main)]">
                  Nenhuma visita agendada.
                </CardContent>
              </Card>
            )}
          </section>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/menu" className="inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao menu
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
