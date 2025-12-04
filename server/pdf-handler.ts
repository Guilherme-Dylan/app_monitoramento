import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { getAllSearchRequests, getAllAnonymousReports } from "./db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Handler para gerar PDF com as solicitações e denúncias
 */
export async function generatePdfReport(req: Request, res: Response) {
  try {
    // Buscar dados do banco
    const requests = await getAllSearchRequests();
    const reports = await getAllAnonymousReports();

    // Criar documento PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Configurar headers da resposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-monitoramento-${new Date().toISOString().split("T")[0]}.pdf"`
    );

    // Pipe do PDF para a resposta
    doc.pipe(res);

    // Título
    doc.fontSize(24).font("Helvetica-Bold").text("Relatório de Monitoramento", {
      align: "center",
    });

    const formattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
    const formattedTime = format(new Date(), "HH:mm:ss", { locale: ptBR });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Gerado em ${formattedDate} às ${formattedTime}`, {
        align: "center",
      });

    doc.moveDown();

    // Resumo
    doc.fontSize(14).font("Helvetica-Bold").text("Resumo Geral");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total de Solicitações: ${requests.length}`);
    doc.text(
      `Solicitações Aprovadas: ${requests.filter((r) => r.status === "approved").length}`
    );
    doc.text(
      `Solicitações Pendentes: ${requests.filter((r) => r.status === "pending").length}`
    );
    doc.text(
      `Solicitações Rejeitadas: ${requests.filter((r) => r.status === "rejected").length}`
    );
    doc.text(`Total de Denúncias: ${reports.length}`);

    doc.moveDown();

    // Solicitações de Busca
    doc.fontSize(14).font("Helvetica-Bold").text("Solicitações de Busca");
    doc.fontSize(10).font("Helvetica");

    if (requests.length > 0) {
      doc.text("ID | Nome | Email | Setor | Status | Data", {
        underline: true,
      });

      requests.forEach((req) => {
        const statusText =
          req.status === "approved"
            ? "Aprovado"
            : req.status === "rejected"
              ? "Rejeitado"
              : "Pendente";
        const date = format(new Date(req.createdAt), "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        });
        doc.fontSize(8).text(
          `${req.id} | ${req.name.substring(0, 15)} | ${req.email.substring(0, 15)} | ${req.department.substring(0, 10)} | ${statusText} | ${date}`
        );
      });
    } else {
      doc.text("Nenhuma solicitação registrada.");
    }

    doc.moveDown();

    // Denúncias Anônimas
    doc.fontSize(14).font("Helvetica-Bold").text("Denúncias Anônimas");
    doc.fontSize(10).font("Helvetica");

    if (reports.length > 0) {
      doc.text("ID | Título | Categoria | Status | Data", {
        underline: true,
      });

      reports.forEach((rep) => {
        const statusText =
          rep.status === "resolved"
            ? "Resolvido"
            : rep.status === "closed"
              ? "Fechado"
              : rep.status === "under_review"
                ? "Em Análise"
                : "Pendente";
        const date = format(new Date(rep.createdAt), "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        });
        doc.fontSize(8).text(
          `${rep.id} | ${rep.title.substring(0, 15)} | ${(rep.category || "N/A").substring(0, 10)} | ${statusText} | ${date}`
        );
      });
    } else {
      doc.text("Nenhuma denúncia registrada.");
    }

    doc.moveDown(2);

    // Rodapé
    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Este é um documento confidencial gerado automaticamente pelo Sistema de Monitoramento.",
        { align: "center" }
      );
    doc.text(`© ${new Date().getFullYear()} - Todos os direitos reservados`, {
      align: "center",
    });

    // Finalizar o documento
    doc.end();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({
      error: "Erro ao gerar PDF",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
