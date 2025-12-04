import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";

export default function ReportPage() {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, isLoading } = trpc.reports.generateHTML.useQuery();

  const handleDownloadPDF = async () => {
    if (!data?.html) {
      toast.error("Relatório não disponível");
      return;
    }

    setIsDownloading(true);
    try {
      // Usar a API do servidor para converter HTML para PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: data.html }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-monitoramento-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      toast.error("Erro ao baixar relatório");
    } finally {
      setIsDownloading(false);
    }
  };

  if (user?.role !== "admin") {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatório de Monitoramento</h1>
          <p className="text-slate-600">Gere e baixe relatórios completos do sistema</p>
        </div>

        <Card className="border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Gerar Relatório em PDF
            </CardTitle>
            <CardDescription>
              Baixe um relatório completo com todas as solicitações e denúncias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  O relatório incluirá um resumo geral, lista completa de solicitações de busca e denúncias anônimas com seus respectivos status.
                </p>
              </div>

              <Button
                onClick={handleDownloadPDF}
                disabled={isLoading || isDownloading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Gerando PDF..." : isLoading ? "Carregando..." : "Baixar Relatório em PDF"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {data && (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Prévia do Relatório</CardTitle>
              <CardDescription>
                Visualização em tempo real do conteúdo do relatório
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
      </div>
    </div>
  );
}
