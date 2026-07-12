"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBoard(title: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: board, error } = await supabase
    .from("boards")
    .insert({ title, owner_id: user.id })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Add owner as a board member
  await supabase.from("board_members").insert({
    board_id: board.id,
    user_id: user.id,
    role: "owner",
  });

  // Create default lists
  await supabase.from("lists").insert([
    { board_id: board.id, title: "To Do", position: 0 },
    { board_id: board.id, title: "In Progress", position: 1 },
    { board_id: board.id, title: "Done", position: 2 },
  ]);

  revalidatePath("/dashboard");
  return { board };
}

export async function getBoards() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { boards: [] };
  }

  const { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { boards: [] };
  }

  return { boards };
}

export async function deleteBoard(boardId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("boards").delete().eq("id", boardId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
