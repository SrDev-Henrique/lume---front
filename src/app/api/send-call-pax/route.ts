// app/api/send-call-pax/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // ⚠️ garantir node runtime para usar a SDK do Resend

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json(); // body esperado: { email, name }
    const { email, name } = body ?? {};

    if (!email) {
      return NextResponse.json(
        { ok: false, message: "email is required" },
        { status: 400 },
      );
    }

    const recipientName = name ?? "passageiro";
    const from = "onboarding@resend.dev";

    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Chamada Sala VIP</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"
        bgcolor="#ffffff">
    <!-- Preheader (hidden in inbox preview) -->
    <div style="display:none;max-height:0;overflow:hidden;visibility:hidden;mso-hide:all;">
      Você foi chamado para acessar a Sala VIP — apresente-se na recepção em até 15 minutos.
    </div>

    <!-- Wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="min-width:100%;padding:28px 12px;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:12px;overflow:hidden;background:#ffffff;">
            <tr>
              <td style="padding:20px 20px 0 20px;background:#ffffff;">

                <!-- Header: use table-based layout for compatibility -->
                <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                  <tr valign="middle">
                    <!-- VIP square -->
                    <td style="width:64px;vertical-align:middle;">
                      <table cellpadding="0" cellspacing="0" role="presentation" style="width:64px;height:64px;border-radius:10px;background:#FF8A2B;" bgcolor="#FF8A2B">
                        <tr>
                          <td align="center" valign="middle" style="font-weight:700;color:#FFFFFF;font-size:18px;line-height:64px;">
                            VIP
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- Gap between square and text -->
                    <td style="width:16px;"></td>

                    <!-- Title / subtitle -->
                    <td style="vertical-align:middle;">
                      <div style="font-size:18px;font-weight:700;color:#111827;line-height:1.1;">Sala VIP</div>
                      <div style="font-size:13px;color:#6B7280;margin-top:4px;">Chamada de acesso</div>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px;background:#ffffff;">
                <h1 style="margin:0 0 8px 0;font-size:20px;color:#111827;font-weight:700;">
                  Olá${recipientName ? `, ${recipientName}` : "!"}
                </h1>

                <p style="margin:0 0 16px 0;font-size:15px;color:#374151;line-height:1.5;">
                  Você foi chamado para acessar a <strong>Sala VIP</strong>. Por favor, dirija-se à recepção e informe seu nome dentro de <strong>15 minutos</strong> a partir deste chamado.
                </p>

                <p style="margin:0 0 22px 0;font-size:15px;color:#6B7280;line-height:1.5;">
                  Caso não se apresente em até 15 minutos, sua vaga será disponibilizada para outro passageiro.
                </p>

                <!-- CTA (mail) -->
                <table cellpadding="0" cellspacing="0" role="presentation" style="margin:18px 0;">
                  <tr>
                    <td align="left">
                      <a href="mailto:${from}?subject=Confirma%C3%A7%C3%A3o%20de%20Presen%C3%A7a%20-%20${encodeURIComponent(
                        recipientName ?? "",
                      )}"
                      style="display:inline-block;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;background:#FF8A2B;color:#ffffff;border:1px solid #FF8A2B;">
                        Confirmar presença
                      </a>
                    </td>
                  </tr>
                </table>

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
              <td style="padding:18px 20px 20px;background:#FAFAFB;color:#9CA3AF;font-size:12px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="font-weight:600;color:#374151;">Nome do Serviço<br/><span style="font-weight:400;color:#6B7280;font-size:12px;">Recepção • Sala VIP</span></td>
                    <td style="text-align:right;font-size:11px;color:#9CA3AF;">© ${new Date().getFullYear()}</td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
          <!-- /Card -->

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

    // Envia com a SDK (garanta RESEND_API_KEY configurada)
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "halbuquerque2850@gmail.com",
      subject:
        "Você foi chamado para acessar a Sala VIP — apresente-se em até 15 minutos",
      html,
      text,
    });

    console.log("[/api/send-call-pax] resend response:", response);

    // Retorna JSON sempre (evita body vazio)
    return NextResponse.json(
      { ok: true, id: response?.data?.id ?? null },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[/api/send-call-pax] error:", error);
    // sempre retornar JSON (mesmo em erro)
    return NextResponse.json(
      {
        ok: false,
        message: String(error?.message ?? "Server error"),
        // opcional para debug em dev:
        ...(process.env.NODE_ENV !== "production"
          ? { stack: error?.stack }
          : {}),
      },
      { status: 500 },
    );
  }
}
