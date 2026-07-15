import { SearchX } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="texture-field-grid rounded-field border border-dashed border-forest-700/20 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-white/5">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-forest-900 text-sand"><SearchX size={18} /></span>
      <p className="field-label mt-5 text-river dark:text-sky-300">No observation found</p>
      <h3 className="mt-2 text-xl font-semibold text-forest-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">{body}</p>
    </div>
  );
}
