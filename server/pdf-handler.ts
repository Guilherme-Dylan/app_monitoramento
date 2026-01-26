import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { getAllSearchRequests, getAllAnonymousReports } from "./db";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

/**
 * Handler para gerar PDF com as solicitações e denúncias
 */
export async function generatePdfReport(req: Request, res: Response) {
  try {
    // Obter data selecionada do corpo da requisição
    const { selectedDate } = req.body;
    let filterDate: Date | undefined;
    
    if (selectedDate) {
      filterDate = new Date(selectedDate);
      console.log("[PDF] Data de filtro recebida:", filterDate);
    }

    // Buscar dados do banco
    let requests = await getAllSearchRequests();
    let reports = await getAllAnonymousReports();

    // Aplicar filtro de data se fornecida
    let dateRangeText = "Todas as datas";
    if (filterDate) {
      const dayStart = startOfDay(filterDate);
      const dayEnd = endOfDay(filterDate);

      console.log("[PDF] Filtrando por intervalo:", dayStart, "até", dayEnd);

      requests = requests.filter((req) => {
        const createdDate = new Date(req.createdAt);
        return createdDate >= dayStart && createdDate <= dayEnd;
      });

      reports = reports.filter((rep) => {
        const createdDate = new Date(rep.createdAt);
        return createdDate >= dayStart && createdDate <= dayEnd;
      });

      dateRangeText = format(filterDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
      console.log("[PDF] Solicitações filtradas:", requests.length);
      console.log("[PDF] Denúncias filtradas:", reports.length);
    }

    // Criar documento PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    // Configurar headers da resposta
    const dateStr = filterDate 
      ? filterDate.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="relatorio-monitoramento-${dateStr}.pdf"`
    );

    // Pipe do PDF para a resposta
    doc.pipe(res);

    // Título
    doc.fontSize(24).font("Helvetica-Bold").text("Relatório de Monitoramento", {
      align: "center",
    });

    // Usar timezone de Brasília
    const timeZone = "America/Sao_Paulo";
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const formattedDate = format(zonedDate, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
    const formattedTime = format(zonedDate, "HH:mm:ss", { locale: ptBR });

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Período: ${dateRangeText}`, {
        align: "center",
      });

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
        const zonedReqDate = toZonedTime(new Date(req.createdAt), timeZone);
        const date = format(zonedReqDate, "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        });
        doc.fontSize(8).text(
          `${req.id} | ${req.name.substring(0, 15)} | ${req.email.substring(0, 15)} | ${req.department.substring(0, 10)} | ${statusText} | ${date}`
        );
      });
    } else {
      doc.text("Nenhuma solicitação registrada para o período selecionado.");
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
        const zonedRepDate = toZonedTime(new Date(rep.createdAt), timeZone);
        const date = format(zonedRepDate, "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        });
        doc.fontSize(8).text(
          `${rep.id} | ${rep.title.substring(0, 15)} | ${(rep.category || "N/A").substring(0, 10)} | ${statusText} | ${date}`
        );
      });
    } else {
      doc.text("Nenhuma denúncia registrada para o período selecionado.");
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
