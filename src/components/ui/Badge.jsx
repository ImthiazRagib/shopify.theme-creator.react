export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white',
    secondary: 'bg-amber-100 text-amber-800 border border-amber-300',
    outline: 'border-2 border-violet-300 text-violet-700 bg-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
