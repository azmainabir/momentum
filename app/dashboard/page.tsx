import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBoards } from "@/lib/actions/boards";
import SignOutButton from "./SignOutButton";
import BoardGrid from "./BoardGrid";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { boards } = await getBoards();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="9" rx="1" fill="white" />
                <rect
                  x="3"
                  y="15"
                  width="7"
                  height="6"
                  rx="1"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="13"
                  y="3"
                  width="7"
                  height="5"
                  rx="1"
                  fill="white"
                  opacity="0.5"
                />
                <rect x="13" y="11" width="7" height="10" rx="1" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">
              Momentum
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Your Boards
        </h1>
        <p className="text-text-secondary mb-8">
          Create a board to start organizing your tasks.
        </p>

        <BoardGrid boards={boards} />
      </div>
    </main>
  );
}
