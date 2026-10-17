import { useState } from "react";
import { cn } from "@/lib/utils";

export interface HireDLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  src?: string;
}

export function HireDLogo({ className, size = "md", showText = true, src }: HireDLogoProps) {
  const [imgError, setImgError] = useState(false);
  const iconSize = size === "sm" ? "size-8" : size === "lg" ? "size-11" : "size-10";

  // If a public image src is provided and loads successfully, render the image
  if (src && !imgError) {
    return (
      <div className={cn("flex items-center gap-3 select-none", className)}>
        <img
          src={src}
          alt="HireD Logo"
          onError={() => setImgError(true)}
          className={cn(
            "object-contain transition-all hover:scale-105",
            size === "sm"
              ? "h-8 w-auto"
              : size === "lg"
                ? "h-11 w-auto max-w-[180px]"
                : "h-9 w-auto max-w-[160px]",
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-primary to-purple-950 shadow-sm shadow-primary/25 ring-1 ring-white/20 transition-all hover:scale-105",
          iconSize,
        )}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="size-5/6 drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="14" y="15" width="8" height="34" rx="4" fill="#FFFFFF" />
          <path
            d="M21 28 L37 28 C39.2 28 41 29.8 41 32 C41 34.2 39.2 36 37 36 L21 36 Z"
            fill="#FFFFFF"
          />
          <rect x="36" y="15" width="8" height="34" rx="4" fill="#FFFFFF" />
          <circle cx="48" cy="18" r="4" fill="#38BDF8" />
          <circle cx="48" cy="18" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground",
              size === "sm" ? "text-base" : size === "lg" ? "text-xl font-extrabold" : "text-lg",
            )}
          >
            Hire<span className="text-primary">D</span>
          </span>
          <span
            className={cn(
              "rounded-md bg-primary/10 font-extrabold tracking-wide text-primary border border-primary/20",
              size === "lg" ? "px-2 py-0.5 text-xs" : "px-1.5 py-0.5 text-[10px]",
            )}
          >
            OPS
          </span>
        </div>
      )}
    </div>
  );
}
