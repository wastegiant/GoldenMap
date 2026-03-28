import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhook = process.env.FEISHU_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Missing FEISHU_WEBHOOK_URL" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.text !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg_type: "text",
      content: {
        text: body.text,
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
