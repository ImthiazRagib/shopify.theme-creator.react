export function Button({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default:
      'bg-zinc-900 text-white border border-zinc-900 hover:bg-zinc-800 focus:ring-zinc-500',
    outline:
      'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 focus:ring-zinc-400',
    ghost:
      'text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-300',
  };
  const sizes = {
    default: 'h-9 px-4 py-2 text-sm gap-2',
    icon: 'h-8 w-8 p-0',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
