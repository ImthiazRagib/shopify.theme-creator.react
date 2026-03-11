export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300 ${className}`}
      {...props}
    />
  );
}
