import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 既存チェック
    const { data: existUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("user_name", username)
      .maybeSingle();

    if (selectError) {
      console.error("SELECT ERROR:", selectError);
      return NextResponse.json({ error: selectError }, { status: 500 });
    }

    if (existUser) {
      return NextResponse.json(
        { error: "ユーザー名が既に存在します" },
        { status: 400 }
      );
    }

    // INSERT
    const { error: insertError } = await supabase.from("users").insert({
      user_name: username,
      password: password,
      max_clear_map: 0,
    });

    if (insertError) {
      console.error("INSERT ERROR:", insertError);
      return NextResponse.json({ error: insertError }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
