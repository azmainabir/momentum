"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  position: number;
};

export default function CardModal({
  card,
  onClose,
  onUpdate,
}: {
  card: Card;
  onClose: () => void;
  onUpdate: (updated: Card) => void;
}) {
  const supabase = createClient();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [priority, setPriority] = useState(card.priority);
  const [dueDate, setDueDate] = useState(
    card.due_date ? card.due_date.split("T")[0] : "",
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("cards")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
      })
      .eq("id", card.id)
      .select()
      .single();

    setSaving(false);

    if (!error && data) {
      onUpdate(data);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Card Details</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text-primary transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary placeholder-muted focus:outline-none focus:border-primary mb-4"
        />

        {/* Description */}
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a more detailed description..."
          rows={4}
          className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary placeholder-muted focus:outline-none focus:border-primary mb-4 resize-none"
        />

        {/* Priority + Due date row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
