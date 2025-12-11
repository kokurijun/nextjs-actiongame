import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { userId, score } = await req.json();

  if (!userId || score === undefined) {
    return NextResponse.json({ error: "invalid data" }, { status: 400 });
  }

  // 既存の max_clear_map を取得
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("max_clear_map")
    .eq("id", userId)
    .single();

  if (fetchError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // もし新しいスコアが大きい場合だけ更新
  if (score > user.max_clear_map) {
    const { error: updateError } = await supabase
      .from("users")
      .update({ max_clear_map: score })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ error: updateError }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
