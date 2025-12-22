import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github } from "lucide-react";

export const metadata = {
  title: "Changelog - Pomodoro Habit",
  description: "Release notes and updates for Pomodoro Habit.",
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-zinc-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <ArrowLeft size={20} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <span className="bg-gradient-to-br from-zinc-900 to-zinc-600 bg-clip-text text-transparent">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/overt/pomodoro-habit" 
              target="_blank"
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Github size={20} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-zinc-600">All the latest updates, improvements, and fixes.</p>
        </div>

        <div className="space-y-12">
          {/* v0.1.1 */}
          <div className="relative pl-8 border-l border-zinc-200">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.1</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">Latest</span>
                <span className="text-zinc-400 text-sm">December 23, 2025</span>
              </div>
              <p className="text-zinc-600">
                A significant update focusing on stability, database reliability, and user experience improvements.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">✨ New Features</h3>
                <ul className="space-y-2 text-zinc-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Auto-transition:</strong> Pomodoro timer now automatically switches between Work, Short Break, and Long Break modes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Configurable Long Break:</strong> Added setting to customize how many work sessions trigger a long break (default: 4).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Sound Notifications:</strong> Added a gentle notification sound when the timer completes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Reset Data:</strong> Added a "Reset All Data" option in Settings to clear the database and start fresh.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">🐛 Bug Fixes</h3>
                <ul className="space-y-2 text-zinc-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Database Connection:</strong> Fixed a critical race condition that prevented creating new Habits, Todos, and Goals on startup.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Timezone Issues:</strong> Fixed a bug where activities were logged to the previous day due to UTC/Local time mismatches.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Calendar Stats:</strong> Resolved an issue where daily statistics (completed habits, focus time) were not appearing in the calendar view.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Theme Switching:</strong> Fixed dark mode not applying correctly to all UI elements.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* v0.1.0 */}
          <div className="relative pl-8 border-l border-zinc-200">
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-zinc-300 border-2 border-white"></div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">v0.1.0</h2>
                <span className="text-zinc-400 text-sm">December 22, 2025</span>
              </div>
              <p className="text-zinc-600">
                Initial public release.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-3">🚀 Initial Release</h3>
                <ul className="space-y-2 text-zinc-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Pomodoro Timer:</strong> Customizable work/break intervals with circular progress visualization.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Habit Tracker:</strong> Daily habit tracking with streak visualization and color coding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Calendar:</strong> Monthly view of productivity with daily activity insights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Todo List:</strong> Simple task management with due dates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Goals:</strong> Long-term goal tracking with progress bars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                    <span><strong>Customization:</strong> Light/Dark mode and custom background image support.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
