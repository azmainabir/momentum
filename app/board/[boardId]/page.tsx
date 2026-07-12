import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import BoardView from './BoardView'

export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>
}) {
  const { boardId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single()

  if (!board) {
    notFound()
  }

  const { data: lists } = await supabase
    .from('lists')
    .select('*')
    .eq('board_id', boardId)
    .order('position')

  const listIds = (lists ?? []).map((l) => l.id)

  const { data: cards } = listIds.length
    ? await supabase
        .from('cards')
        .select('*')
        .in('list_id', listIds)
        .order('position')
    : { data: [] }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-surface shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-text-primary">{board.title}</h1>
          </div>
        </div>
      </header>

      <BoardView
        boardId={boardId}
        initialLists={lists ?? []}
        initialCards={cards ?? []}
      />
    </main>
  )
}