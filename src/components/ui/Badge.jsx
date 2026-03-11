export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-zinc-800 text-white',
    secondary: 'bg-zinc-100 text-zinc-800 border border-zinc-300',
    outline: 'border border-zinc-300 text-zinc-700 bg-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
