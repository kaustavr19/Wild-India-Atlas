import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-forest-700/10 px-4 py-8 dark:border-white/10 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Wild India Atlas — a map-first wildlife travel guide. Local, static data; no live database.</p>
        <Link href="/data-sources" className="font-semibold text-river hover:underline dark:text-sky-300">
          How we verify data →
        </Link>
      </div>
    </footer>
  );
}
