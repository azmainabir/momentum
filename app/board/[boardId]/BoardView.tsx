"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardModal from "./CardModal";

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

function CardItem({
  card,
  onDelete,
  onClick,
  isOverlay,
}: {
  card: Card;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-surface-2 border rounded-xl p-3 group cursor-grab active:cursor-grabbing transition-colors duration-200 ${
        isDragging
          ? "opacity-40 border-primary"
          : isOverlay
            ? "border-primary shadow-2xl rotate-3"
            : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-text-primary text-sm leading-snug flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          {card.title}
        </p>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
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
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${priorityColors[card.priority]}`}
        >
          {card.priority}
        </span>
        {card.due_date && (
          <span className="text-[10px] text-text-secondary flex items-center gap-1">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {new Date(card.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

function ListDropArea({
  listId,
  children,
}: {
  listId: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: listId,
    data: { type: "list" },
  });

  return (
    <div
      ref={setNodeRef}
      className="px-3 pb-3 flex flex-col gap-2 overflow-y-auto min-h-[60px] flex-1"
    >
      {children}
    </div>
  );
}

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
  const [lists] = useState<List[]>(initialLists);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleAddCard = async (listId: string) => {
    if (!newCardTitle.trim()) return;
    const listCards = cards.filter((c) => c.list_id === listId);
    const { data: card, error } = await supabase
      .from("cards")
      .insert({
        list_id: listId,
        title: newCardTitle.trim(),
        position: listCards.length,
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

  const handleUpdateCard = (updated: Card) => {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeCard = cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const overList = lists.find((l) => l.id === overId);
    if (overList && activeCard.list_id !== overList.id) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, list_id: overList.id } : c,
        ),
      );
      return;
    }

    const overCard = cards.find((c) => c.id === overId);
    if (overCard && activeCard.list_id !== overCard.list_id) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, list_id: overCard.list_id } : c,
        ),
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCard = cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    let newCards = [...cards];

    const overCard = cards.find((c) => c.id === overId);
    if (
      overCard &&
      activeId !== overId &&
      activeCard.list_id === overCard.list_id
    ) {
      const listCards = newCards
        .filter((c) => c.list_id === activeCard.list_id)
        .sort((a, b) => a.position - b.position);
      const oldIndex = listCards.findIndex((c) => c.id === activeId);
      const newIndex = listCards.findIndex((c) => c.id === overId);
      const reordered = arrayMove(listCards, oldIndex, newIndex);

      reordered.forEach((c, i) => {
        const idx = newCards.findIndex((nc) => nc.id === c.id);
        newCards[idx] = { ...newCards[idx], position: i };
      });
    }

    lists.forEach((list) => {
      const listCards = newCards
        .filter((c) => c.list_id === list.id)
        .sort((a, b) => a.position - b.position);
      listCards.forEach((c, i) => {
        const idx = newCards.findIndex((nc) => nc.id === c.id);
        newCards[idx] = { ...newCards[idx], position: i };
      });
    });

    setCards(newCards);

    const updates = newCards.map((c) =>
      supabase
        .from("cards")
        .update({ list_id: c.list_id, position: c.position })
        .eq("id", c.id),
    );
    await Promise.all(updates);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
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
                  <div className="px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary text-sm">
                      {list.title}
                    </h3>
                    <span className="text-xs text-muted bg-surface-2 px-2 py-0.5 rounded-full">
                      {listCards.length}
                    </span>
                  </div>

                  <SortableContext
                    items={listCards.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ListDropArea listId={list.id}>
                      {listCards.map((card) => (
                        <CardItem
                          key={card.id}
                          card={card}
                          onDelete={handleDeleteCard}
                          onClick={() => setSelectedCard(card)}
                        />
                      ))}

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
                    </ListDropArea>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? <CardItem card={activeCard} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleUpdateCard}
        />
      )}
    </>
  );
}
