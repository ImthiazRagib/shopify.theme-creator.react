export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border-2 border-violet-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 resize-y ${className}`}
      {...props}
    />
  );
}
