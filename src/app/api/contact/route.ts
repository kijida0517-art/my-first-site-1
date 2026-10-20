import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, category, title, message } = body;

    // 필수값 검증
    if (!name || !contact || !title || !message) {
      return NextResponse.json(
        { error: "필수 입력 항목(이름, 연락처, 제목, 내용)이 누락되었습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "your_email@example.com";
    const senderEmail = process.env.CONTACT_SENDER_EMAIL || "onboarding@resend.dev";

    // API Key가 아직 입력되지 않았거나 기본값인 경우 안내
    if (!apiKey || apiKey === "re_your_api_key_here") {
      return NextResponse.json({
        success: true,
        isMock: true,
        message:
          ".env.local 파일에 RESEND_API_KEY가 아직 설정되지 않아 시뮬레이션 모드로 접수되었습니다. .env.local에 실제 Resend 키를 입력하시면 즉시 실제 메일이 발송됩니다.",
      });
    }

    const resend = new Resend(apiKey);

    // 이메일 HTML 템플릿
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a192f; color: #fef08a; padding: 32px; border-radius: 16px; border: 1px solid rgba(147, 197, 253, 0.2);">
        <div style="border-bottom: 1px solid rgba(254, 240, 138, 0.2); padding-bottom: 16px; margin-bottom: 24px;">
          <span style="background: #ef4444; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold;">
            ${category || "일반 문의"}
          </span>
          <h2 style="color: #fde047; margin: 12px 0 4px 0; font-size: 22px;">${title}</h2>
          <p style="color: #93c5fd; font-size: 13px; margin: 0;">포트폴리오 웹사이트를 통해 새로운 문의사항이 접수되었습니다.</p>
        </div>

        <div style="background: rgba(15, 34, 68, 0.8); border: 1px solid rgba(147, 197, 253, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="margin-bottom: 12px;">
            <strong style="color: #93c5fd; font-size: 13px; display: block;">작성자 / 회사명</strong>
            <span style="color: #ffffff; font-size: 15px; font-weight: 600;">${name}</span>
          </div>
          <div>
            <strong style="color: #93c5fd; font-size: 13px; display: block;">회신 연락처 / 이메일</strong>
            <a href="mailto:${contact}" style="color: #fde047; font-size: 15px; text-decoration: underline;">${contact}</a>
          </div>
        </div>

        <div style="background: #08152e; border: 1px solid rgba(147, 197, 253, 0.15); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <strong style="color: #93c5fd; font-size: 13px; display: block; margin-bottom: 8px;">문의 내용</strong>
          <p style="color: #fef9c3; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="text-align: center; border-top: 1px solid rgba(254, 240, 138, 0.15); padding-top: 16px; font-size: 12px; color: #64748b;">
          접수 일시: ${new Date().toLocaleString("ko-KR")}
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: receiverEmail,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `[웹사이트 문의] ${category ? `[${category}] ` : ""}${title} - ${name}님`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: `이메일 발송에 실패했습니다: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("API error:", err);
    return NextResponse.json(
      { error: `서버 처리 중 오류가 발생했습니다: ${errorMsg}` },
      { status: 500 }
    );
  }
}
