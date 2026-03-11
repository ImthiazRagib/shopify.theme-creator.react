export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`border border-zinc-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
