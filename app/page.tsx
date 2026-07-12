import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
          <span className="text-3xl font-bold text-text-primary">Momentum</span>
        </div>

        <h1 className="text-5xl font-bold text-text-primary mb-6 leading-tight">
          Manage your work, <span className="text-primary">beautifully</span>
        </h1>

        <p className="text-xl text-text-secondary mb-10 leading-relaxed">
          A real-time collaborative Kanban board. Organize tasks, track
          progress, and ship faster — together.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all duration-200 text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-surface-2 hover:bg-border text-text-primary font-semibold rounded-xl transition-all duration-200 text-lg border border-border"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-24 w-full">
        <div className="bg-surface rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3 className="text-text-primary font-semibold text-lg mb-2">
            Real-time Sync
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            See changes instantly as your team moves cards and updates tasks in
            real time.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <h3 className="text-text-primary font-semibold text-lg mb-2">
            Drag and Drop
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Intuitive drag and drop interface to move tasks across columns
            effortlessly.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-text-primary font-semibold text-lg mb-2">
            Team Collaboration
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Invite teammates to boards and collaborate with role-based access
            control.
          </p>
        </div>
      </div>

      <footer className="mt-24 text-center text-text-secondary text-sm">
        <p>
          Developed by Azmain Tahmid Abir |{" "}
          <a
            href="https://linkedin.com/in/azmain-abir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LinkedIn
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/azmainabir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </main>
  );
}
