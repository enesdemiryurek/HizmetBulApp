"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return (
    <section ref={ref} className={cn("overflow-hidden pt-0 md:pt-0 relative", className)}>
      <motion.div 
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } }
        }}
        className="relative z-10 mx-auto flex max-w-[80rem] flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8 md:py-24"
      >
        {/* Badge */}
        {badge && (
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-black/50 backdrop-blur-sm"
            >
              <span className="text-gray-600 dark:text-gray-300">{badge.text}</span>
            </Badge>
          </motion.div>
        )}

        {/* Title */}
        <motion.h2 variants={fadeUp} className="text-3xl font-black sm:text-5xl text-rose-950 dark:text-white">
          {title}
        </motion.h2>

        {/* Description */}
        {description && (
          <motion.p variants={fadeUp} className="text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
            {description}
          </motion.p>
        )}

        {/* Action Button */}
        <motion.div variants={fadeUp}>
          <Button
            variant={action.variant || "default"}
            size="lg"
            className="rounded-2xl px-8 shadow-rose-500/25"
            asChild
          >
            <Link href={action.href}>{action.text}</Link>
          </Button>
        </motion.div>

        {/* Glow Effect */}
        {withGlow && (
          <motion.div 
            variants={scaleIn}
            className="fade-top-lg pointer-events-none absolute inset-0 rounded-[3rem] shadow-glow" 
          />
        )}
      </motion.div>
    </section>
  )
}
