export function Button({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-medium transition-all rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default:
      'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-300/50 hover:from-violet-700 hover:to-fuchsia-700 focus:ring-violet-500',
    outline:
      'border-2 border-violet-300 bg-white text-violet-700 hover:bg-violet-50 focus:ring-violet-400',
    ghost:
      'text-violet-700 hover:bg-violet-100 focus:ring-violet-300',
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
