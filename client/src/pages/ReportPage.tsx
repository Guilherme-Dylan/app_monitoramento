import { useAuth } from "@/_core/hooks/useAuth";
import { AppHeader } from "@/components/home/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ReportPage() {
  const { user, logout, isAuthenticated, loading } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/login",
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { data, isLoading } = trpc.reports.generateHTML.useQuery(
    {
      selectedDate,
    },
    {
      enabled: user?.tipo_de_user === "admin",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  );

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedDate: selectedDate ? selectedDate.toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const dateStr = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      link.download = `relatorio-monitoramento-${dateStr}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao baixar relatório");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    if (dateString) {
      setSelectedDate(new Date(`${dateString}T00:00:00`));
      return;
    }
    setSelectedDate(undefined);
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
                <Link href="/menu" className="inline-flex items-center gap-2">
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="theme-hero-title mb-2">Relatórios de monitoramento</h1>
            <p className="theme-hero-subtitle">Gere e baixe relatórios completos do sistema.</p>
          </div>

          <Card className="theme-surface-card mb-6 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Gerar relatório em PDF
              </CardTitle>
              <CardDescription>
                Baixe um relatório completo com todas as solicitações e denúncias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    O relatório inclui resumo geral, solicitações de busca e denúncias anônimas com status.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Selecionar data (opcional)
                  </Label>
                  <Input
                    id="report-date"
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                    onChange={handleDateChange}
                    className="border-slate-300"
                  />
                  <p className="text-xs text-slate-500">
                    {selectedDate
                      ? `Relatório será gerado apenas com dados de ${selectedDate.toLocaleDateString("pt-BR")}`
                      : "Deixe em branco para gerar relatório com todos os dados"}
                  </p>
                </div>

                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading || isLoading}
                  className="btn-premium btn-premium-blue w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? "Gerando PDF..." : "Baixar relatório em PDF"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {data && (
            <Card className="theme-surface-card bg-white/95">
              <CardHeader>
                <CardTitle>Prévia do relatório</CardTitle>
                <CardDescription>
                  Visualização em tempo real do conteúdo do relatório.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none bg-white p-4 rounded border border-slate-200 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: data.html }}
                />
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/menu" className="inline-flex items-center gap-2">
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
