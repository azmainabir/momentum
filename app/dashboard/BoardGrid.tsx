"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBoard, deleteBoard } from "@/lib/actions/boards";

type Board = {
  id: string;
  title: string;
  created_at: string;
};

export default function BoardGrid({ boards }: { boards: Board[] }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const result = await createBoard(title.trim());
    setLoading(false);
    if (result.board) {
      setShowModal(false);
      setTitle("");
      router.push(`/board/${result.board.id}`);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    if (confirm("Delete this board? This cannot be undone.")) {
      await deleteBoard(boardId);
      router.refresh();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create board card */}
        <button
          onClick={() => setShowModal(true)}
          className="h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-text-secondary hover:border-primary hover:text-primary transition-all duration-200"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="font-medium">Create new board</span>
        </button>

        {/* Board cards */}
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => router.push(`/board/${board.id}`)}
            className="h-32 bg-surface border border-border rounded-2xl p-5 cursor-pointer hover:border-primary transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-text-primary font-semibold text-lg truncate">
                {board.title}
              </h3>
              <button
                onClick={(e) => handleDelete(e, board.id)}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all duration-200"
                title="Delete board"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                </svg>
              </button>
            </div>
            <p className="text-text-secondary text-xs">
              Created {new Date(board.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Create new board
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Board title (e.g. My Project)"
              autoFocus
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary placeholder-muted focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={loading || !title.trim()}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200"
              >
                {loading ? "Creating..." : "Create board"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
