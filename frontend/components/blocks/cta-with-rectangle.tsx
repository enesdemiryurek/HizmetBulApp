"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CTAProps {
  badge?: {
    text: string
  }
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: "default" | "ghost" | "link" | "destructive" | "outline" | "secondary"
  }
  withGlow?: boolean
  className?: string
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
}: CTAProps) {
  return (
    <section className={cn("overflow-hidden pt-0 md:pt-0 relative", className)}>
      <div className="relative z-10 mx-auto flex max-w-[80rem] flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24">
        {/* Badge */}
        {badge && (
          <Badge
            variant="outline"
            className="opacity-0 animate-fade-in-up delay-100 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
          >
            <span className="text-gray-600 dark:text-gray-300">{badge.text}</span>
          </Badge>
        )}

        {/* Title */}
        <h2 className="text-3xl font-black sm:text-5xl opacity-0 animate-fade-in-up delay-200 text-rose-950 dark:text-white">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-gray-600 dark:text-gray-400 opacity-0 animate-fade-in-up delay-300 max-w-2xl font-medium">
            {description}
          </p>
        )}

        {/* Action Button */}
        <Button
          variant={action.variant || "default"}
          size="lg"
          className="opacity-0 animate-fade-in-up delay-500 rounded-2xl px-8 shadow-rose-500/25"
          asChild
        >
          <Link href={action.href}>{action.text}</Link>
        </Button>

        {/* Glow Effect */}
        {withGlow && (
          <div className="fade-top-lg pointer-events-none absolute inset-0 rounded-[3rem] shadow-glow opacity-0 animate-scale-in delay-700" />
        )}
      </div>
    </section>
  )
}
