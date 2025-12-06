/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
import { Resend } from "resend";

const resend = new Resend("re_9MA5DfLM_JGt8wT7hqPTtCBJ1NS6rbLWT");
export type CallPaxEmailParams = {
  passenger: { email: string; name?: string | null };
};

export async function sendCallPaxEmail({
  passenger,
}: CallPaxEmailParams): Promise<any> {
  const from = "onboarding@resend.dev";
  const recipientName = passenger.name ? passenger.name : "passageiro";

  const subject =
    "Você foi chamado para acessar a Sala VIP — apresente-se em até 15 minutos";

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Chamada Sala VIP</title>
    </head>
    <body style="margin:0;padding:0;background:#F7F7F8;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <!-- Preheader (hidden in inbox preview) -->
      <div style="display:none;max-height:0;overflow:hidden;visibility:hidden;mso-hide:all;">
        Você foi chamado para acessar a Sala VIP — apresente-se na recepção em até 15 minutos.
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 12px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:12px;overflow:hidden;background:linear-gradient(180deg, #FFFFFF 0%, #FBFBFB 100%);box-shadow:0 10px 30px rgba(20,20,20,0.06);">
              <!-- Header -->
              <tr>
                <td style="padding:20px 28px;background:transparent;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:48px;height:48px;border-radius:10px;background:#FF8A2B;display:flex;align-items:center;justify-content:center;font-weight:700;color:#ffffff;font-size:18px;">
                      VIP
                    </div>
                    <div>
                      <div style="font-size:16px;font-weight:700;color:#111827;">Sala VIP</div>
                      <div style="font-size:13px;color:#6B7280;">Chamada de acesso</div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px;background:transparent;">
                  <h1 style="margin:0 0 8px 0;font-size:20px;color:#111827;">Olá${recipientName ? `, ${recipientName}` : "!"}</h1>

                  <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.5;">
                    Você foi chamado para acessar a <strong>Sala VIP</strong>. Por favor, dirija-se à recepção e informe seu nome dentro de <strong>15 minutos</strong> a partir deste chamado.
                  </p>

                  <p style="margin:0 0 22px 0;font-size:15px;color:#374151;line-height:1.5;">
                    Caso não se apresente em até 15 minutos, sua vaga será disponibilizada para outro passageiro.
                  </p>

                  <!-- CTA (opcional: confirma por e-mail) -->
                  <div style="margin:18px 0;">
                    <a
                      href="mailto:${from}?subject=Confirma%C3%A7%C3%A3o%20de%20Presen%C3%A7a%20-%20${encodeURIComponent(
                        recipientName ?? "",
                      )}"
                      style="display:inline-block;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;background:#FF8A2B;color:#ffffff;border:1px solid #FF8A2B;"
                      >Confirmar presença</a>
                  </div>

                  <p style="margin:0 0 8px 0;font-size:13px;color:#6B7280;">
                    Dúvidas? Responda este e-mail ou fale diretamente com a recepção do lounge.
                  </p>

                  <hr style="border:none;height:1px;background:#E6E6E9;margin:18px 0;" />

                  <p style="margin:0;font-size:12px;color:#9CA3AF;">
                    Observação: esta chamada expira 15 minutos após o envio. Agradecemos por utilizar nosso serviço VIP.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 28px 28px;background:#FAFAFB;color:#9CA3AF;font-size:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                    <div>
                      <div style="font-weight:600;color:#374151;">Nome do Serviço</div>
                      <div>Recepção • Sala VIP</div>
                    </div>
                    <div style="text-align:right;">
                      <div style="font-size:11px;color:#9CA3AF;">© ${new Date().getFullYear()}</div>
                    </div>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const text = `Olá${recipientName ? `, ${recipientName}` : ""}!

Você foi chamado para acessar a Sala VIP. Por favor, apresente-se na recepção e informe seu nome em até 15 minutos a partir deste chamado.
Caso não se apresente em até 15 minutos, sua vaga será disponibilizada para outro passageiro.

Se precisar, responda este e-mail ou procure a recepção.
`;

  try {
    const response = await resend.emails.send({
      from,
      to: "halbuquerque2850@gmail.com",
      subject,
      html,
      text,
    });

    // log útil para garantir que a API criou o email
    console.log("[sendCallPaxEmail] resend.emails.send response:", response);
    return response;
  } catch (error) {
    // log detalhado para debug (dashboard/console)
    console.error("[sendCallPaxEmail] erro ao chamar Resend:", error);
    // rethrow para o chamador decidir o que exibir
    throw error;
  }
}
