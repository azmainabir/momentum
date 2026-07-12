"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type List = {
  id: string;
  board_id: string;
  title: string;
  position: number;
};

type Card = {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  position: number;
};

const priorityColors = {
  low: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-red-500/20 text-red-400",
};

export default function BoardView({
  boardId,
  initialLists,
  initialCards,
}: {
  boardId: string;
  initialLists: List[];
  initialCards: Card[];
}) {
  const supabase = createClient();
  const [lists, setLists] = useState<List[]>(initialLists);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = async (listId: string) => {
    if (!newCardTitle.trim()) return;

    const listCards = cards.filter((c) => c.list_id === listId);
    const position = listCards.length;

    const { data: card, error } = await supabase
      .from("cards")
      .insert({
        list_id: listId,
        title: newCardTitle.trim(),
        position,
      })
      .select()
      .single();

    if (!error && card) {
      setCards([...cards, card]);
      setNewCardTitle("");
      setAddingCardTo(null);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);
    if (!error) {
      setCards(cards.filter((c) => c.id !== cardId));
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex gap-4 h-full items-start">
        {lists.map((list) => {
          const listCards = cards
            .filter((c) => c.list_id === list.id)
            .sort((a, b) => a.position - b.position);

          return (
            <div
              key={list.id}
              className="w-72 shrink-0 bg-surface border border-border rounded-2xl flex flex-col max-h-full"
            >
              {/* List header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-text-primary text-sm">
                  {list.title}
                </h3>
                <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                  {listCards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="px-3 pb-3 flex flex-col gap-2 overflow-y-auto">
                {listCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-surface-2 border border-border rounded-xl p-3 group cursor-pointer hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-text-primary text-sm leading-snug">
                        {card.title}
                      </p>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all duration-200 shrink-0"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add card */}
                {addingCardTo === list.id ? (
                  <div className="bg-surface-2 border border-primary rounded-xl p-3">
                    <input
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCard(list.id);
                        if (e.key === "Escape") {
                          setAddingCardTo(null);
                          setNewCardTitle("");
                        }
                      }}
                      placeholder="Card title..."
                      autoFocus
                      className="w-full bg-transparent text-text-primary text-sm placeholder-muted focus:outline-none"
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAddCard(list.id)}
                        className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingCardTo(null);
                          setNewCardTitle("");
                        }}
                        className="px-3 py-1.5 text-text-secondary hover:text-text-primary text-xs transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCardTo(list.id)}
                    className="text-left px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-xl text-sm transition-all duration-200"
                  >
                    + Add a card
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
