"use client";

import * as React from "react";

interface MagicProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  indicatorClassName?: string;
}

const MagicProgress = React.forwardRef<HTMLDivElement, MagicProgressProps>(
  ({ className, value = 0, indicatorClassName, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}
        {...props}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 transition-all duration-500 ease-out ${indicatorClassName}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        >
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent,25%,rgba(255,255,255,0.5),50%,transparent)]" />
        </div>
      </div>
    );
  }
);
MagicProgress.displayName = "MagicProgress";

export { MagicProgress };