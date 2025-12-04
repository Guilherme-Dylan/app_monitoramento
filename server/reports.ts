import { getAllSearchRequests, getAllAnonymousReports } from "./db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Gerar relatório em HTML para conversão em PDF
 */
export async function generateReportHTML() {
  const requests = await getAllSearchRequests();
  const reports = await getAllAnonymousReports();

  const formattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(new Date(), "HH:mm:ss", { locale: ptBR });

  const requestsHTML = requests
    .map(
      (req) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${req.id}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${req.name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${req.email}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${req.department}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <span style="padding: 4px 8px; border-radius: 4px; ${
          req.status === "approved"
            ? "background-color: #d4edda; color: #155724;"
            : req.status === "rejected"
              ? "background-color: #f8d7da; color: #721c24;"
              : "background-color: #fff3cd; color: #856404;"
        }">${
          req.status === "approved"
            ? "Aprovado"
            : req.status === "rejected"
              ? "Rejeitado"
              : "Pendente"
        }</span>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">${format(
        new Date(req.createdAt),
        "dd/MM/yyyy HH:mm",
        { locale: ptBR }
      )}</td>
    </tr>
  `
    )
    .join("");

  const reportsHTML = reports
    .map(
      (rep) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${rep.id}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${rep.title}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${rep.category || "Sem categoria"}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <span style="padding: 4px 8px; border-radius: 4px; ${
          rep.status === "resolved"
            ? "background-color: #d4edda; color: #155724;"
            : rep.status === "closed"
              ? "background-color: #e2e3e5; color: #383d41;"
              : rep.status === "under_review"
                ? "background-color: #d1ecf1; color: #0c5460;"
                : "background-color: #fff3cd; color: #856404;"
        }">${
          rep.status === "resolved"
            ? "Resolvido"
            : rep.status === "closed"
              ? "Fechado"
              : rep.status === "under_review"
                ? "Em Análise"
                : "Pendente"
        }</span>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">${format(
        new Date(rep.createdAt),
        "dd/MM/yyyy HH:mm",
        { locale: ptBR }
      )}</td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Monitoramento</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #0066cc;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #0066cc;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          color: #0066cc;
          border-bottom: 2px solid #0066cc;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #0066cc;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background-color: #f0f4f8;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #0066cc;
        }
        .summary-card h3 {
          margin: 0;
          color: #0066cc;
          font-size: 14px;
          text-transform: uppercase;
        }
        .summary-card p {
          margin: 5px 0 0 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Relatório de Monitoramento</h1>
          <p>Gerado em ${formattedDate} às ${formattedTime}</p>
        </div>

        <div class="section">
          <h2>Resumo Geral</h2>
          <div class="summary">
            <div class="summary-card">
              <h3>Total de Solicitações</h3>
              <p>${requests.length}</p>
            </div>
            <div class="summary-card">
              <h3>Solicitações Aprovadas</h3>
              <p>${requests.filter((r) => r.status === "approved").length}</p>
            </div>
            <div class="summary-card">
              <h3>Solicitações Pendentes</h3>
              <p>${requests.filter((r) => r.status === "pending").length}</p>
            </div>
            <div class="summary-card">
              <h3>Total de Denúncias</h3>
              <p>${reports.length}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Solicitações de Busca</h2>
          ${
            requests.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Setor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                ${requestsHTML}
              </tbody>
            </table>
          `
              : "<p>Nenhuma solicitação registrada.</p>"
          }
        </div>

        <div class="section">
          <h2>Denúncias Anônimas</h2>
          ${
            reports.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                ${reportsHTML}
              </tbody>
            </table>
          `
              : "<p>Nenhuma denúncia registrada.</p>"
          }
        </div>

        <div class="footer">
          <p>Este é um documento confidencial gerado automaticamente pelo Sistema de Monitoramento.</p>
          <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}
