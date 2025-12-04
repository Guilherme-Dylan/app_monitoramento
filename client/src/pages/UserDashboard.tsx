import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: requests, isLoading } = trpc.searchRequests.getUserRequests.useQuery();

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Meu Dashboard</h1>
          <p className="text-slate-600">Bem-vindo, {user?.name}! Veja o histórico de suas solicitações.</p>
        </div>

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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Fazer uma Solicitação
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
