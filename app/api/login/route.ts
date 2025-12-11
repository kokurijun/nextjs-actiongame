import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // user_name カラムで検索
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_name", username)
    .single();

  if (error || !user) {
    return new NextResponse("ユーザーが存在しません", { status: 401 });
  }

  // パスワードチェック（平文でOKの方針）
  if (user.password !== password) {
    return new NextResponse("パスワードが違います", { status: 401 });
  }

  return NextResponse.json({
  ok: true,
  userId: user.id,
  userName: user.user_name,
});
}
