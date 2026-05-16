import { useEffect, useId, useState } from "react"
import type { SVGProps } from "react"
import { useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GaugeProps extends Omit<SVGProps<SVGSVGElement>, "className"> {
  value: number
  size?: number | string
  gapPercent?: number
  strokeWidth?: number
  trackWidth?: number
  equal?: boolean
  showValue?: boolean
  showPercentage?: boolean
  primary?: "danger" | "warning" | "success" | "info" | string | { [key: number]: string }
  secondary?: "danger" | "warning" | "success" | "info" | string | { [key: number]: string }
  gradient?: boolean
  gradientEnd?: string
  gaugeType?: "full" | "half" | "quarter"
  transition?: { length?: number; step?: number; delay?: number }
  className?: string | { svgClassName?: string; primaryClassName?: string; secondaryClassName?: string; textClassName?: string }
  label?: string
  unit?: string
  min?: number
  max?: number
  glowEffect?: boolean
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, (num >> 16) + Math.round(255 * amount))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount))
  const b = Math.min(255, (num & 0xff) + Math.round(255 * amount))
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount))
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount))
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount))
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

function resolveColor(colorProp: GaugeProps["primary"], strokePercent: number, isSecondary = false): string {
  const defaultColors = isSecondary
    ? { danger: "#fecaca", warning: "#fde68a", info: "#bfdbfe", success: "#bbf7d0" }
    : { danger: "#dc2626", warning: "#f59e0b", info: "#3b82f6", success: "#22c55e" }
  if (!colorProp) {
    if (isSecondary) return "rgba(160,160,160,0.18)"
    return strokePercent <= 25 ? defaultColors.danger : strokePercent <= 50 ? defaultColors.warning : strokePercent <= 75 ? defaultColors.info : defaultColors.success
  }
  if (typeof colorProp === "string") return defaultColors[colorProp as keyof typeof defaultColors] || colorProp
  if (typeof colorProp === "object") {
    const keys = Object.keys(colorProp).sort((a, b) => Number(a) - Number(b))
    const checkValue = isSecondary ? 100 - strokePercent : strokePercent
    for (let i = 0; i < keys.length; i++) {
      const currentKey = Number(keys[i])
      const nextKey = Number(keys[i + 1])
      if (checkValue >= currentKey && (checkValue < nextKey || !nextKey)) {
        const color = colorProp[currentKey]
        return defaultColors[color as keyof typeof defaultColors] || color
      }
    }
  }
  return isSecondary ? "rgba(160,160,160,0.18)" : "#3b82f6"
}

export function Gauge({
  value,
  size = 150,
  gapPercent = 5,
  strokeWidth = 10,
  trackWidth,
  equal = false,
  showValue = true,
  showPercentage = false,
  primary,
  secondary,
  gradient = false,
  gradientEnd,
  gaugeType = "full",
  transition = { length: 1000, step: 200, delay: 0 },
  className,
  label,
  unit = "%",
  min = 0,
  max = 100,
  glowEffect = false,
  ...props
}: GaugeProps) {
  const uid = useId().replace(/:/g, "")
  const resolvedTrackWidth = trackWidth ?? strokeWidth
  const circleSize = 100
  const radius = circleSize / 2 - Math.max(strokeWidth, resolvedTrackWidth) / 2
  const circumference = 2 * Math.PI * radius

  const offsetFactor = equal ? 0.5 : 0
  const offsetFactorSecondary = 1 - offsetFactor

  const { formattedValue: animatedValue, rawValue: animatedRawValue } = useNumberCounter({
    value,
    delay: (transition?.delay ?? 0) / 1000,
    decimalPlaces: value % 1 !== 0 ? 1 : 0,
  })

  const strokePercent = animatedRawValue

  const gaugeConfig = (() => {
    switch (gaugeType) {
      case "half": return { startAngle: -90, endAngle: 90, circumferenceFactor: 0.5 }
      case "quarter": return { startAngle: 0, endAngle: 90, circumferenceFactor: 0.25 }
      default: return { startAngle: -90, endAngle: 270, circumferenceFactor: 1 }
    }
  })()

  const adjustedCircumference = circumference * gaugeConfig.circumferenceFactor
  const adjustedPercentToPx = adjustedCircumference / 100

  const primaryStrokeDasharray = () => {
    if (offsetFactor > 0 && strokePercent > 100 - gapPercent * 2 * offsetFactor) {
      const subtract = -strokePercent + 100
      return `${Math.max(strokePercent * adjustedPercentToPx - subtract * adjustedPercentToPx, 0)} ${adjustedCircumference}`
    }
    const subtract = gapPercent * 2 * offsetFactor
    return `${Math.max(strokePercent * adjustedPercentToPx - subtract * adjustedPercentToPx, 0)} ${adjustedCircumference}`
  }

  const secondaryStrokeDasharray = () => {
    if (offsetFactorSecondary < 1 && strokePercent < gapPercent * 2 * offsetFactorSecondary) {
      const subtract = strokePercent
      return `${Math.max((100 - strokePercent) * adjustedPercentToPx - subtract * adjustedPercentToPx, 0)} ${adjustedCircumference}`
    }
    const subtract = gapPercent * 2 * offsetFactorSecondary
    return `${Math.max((100 - strokePercent) * adjustedPercentToPx - subtract * adjustedPercentToPx, 0)} ${adjustedCircumference}`
  }

  const primaryTransform = () => {
    if (offsetFactor > 0 && strokePercent > 100 - gapPercent * 2 * offsetFactor) {
      const add = 0.5 * (-strokePercent + 100)
      return `rotate(${-90 + add * (360 / 100)}deg)`
    }
    const add = gapPercent * offsetFactor
    return `rotate(${-90 + add * (360 / 100)}deg)`
  }

  const secondaryTransform = () => {
    if (offsetFactorSecondary < 1 && strokePercent < gapPercent * 2 * offsetFactorSecondary) {
      const subtract = 0.5 * strokePercent
      return `rotate(${360 - 90 - subtract * (360 / 100)}deg) scaleY(-1)`
    }
    const subtract = gapPercent * offsetFactorSecondary
    return `rotate(${360 - 90 - subtract * (360 / 100)}deg) scaleY(-1)`
  }

  const primaryColor = resolveColor(primary, strokePercent)
  const secondaryColor = resolveColor(secondary, strokePercent, true)

  const brightColor = gradientEnd ? lighten(gradientEnd, 0.22) : lighten(primaryColor, 0.28)
  const highlightColor = gradientEnd ? lighten(gradientEnd, 0.42) : lighten(primaryColor, 0.48)
  const darkColor = darken(primaryColor, 0.18)
  const midColor = gradientEnd || primaryColor

  const primaryOpacity = () => (offsetFactor > 0 && strokePercent < gapPercent * 2 * offsetFactor && strokePercent < gapPercent * 2 * offsetFactorSecondary) ? 0 : 1
  const secondaryOpacity = () => ((offsetFactor === 0 && strokePercent > 100 - gapPercent * 2) || (offsetFactor > 0 && strokePercent > 100 - gapPercent * 2 * offsetFactor && strokePercent > 100 - gapPercent * 2 * offsetFactorSecondary)) ? 0 : 1

  const sharedCircle = {
    cx: circleSize / 2,
    cy: circleSize / 2,
    r: radius,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDashoffset: 0,
    strokeWidth,
    style: { transformOrigin: "50% 50%", shapeRendering: "geometricPrecision" as const },
  }

  const glowColor = primaryColor + "88"
  const glowColorFaint = primaryColor + "33"

  return (
    <div className="relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${circleSize} ${circleSize}`}
        width={size}
        height={size}
        style={{ userSelect: "none", overflow: "visible" }}
        fill="none"
        className={cn("", typeof className === "string" ? className : (className as any)?.svgClassName)}
        {...props}
      >
        <defs>
          {/* Main arc gradient: bright highlight top → mid → dark bottom for 3D volumetric feel */}
          <linearGradient id={`arcMain-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="30%" stopColor={brightColor} />
            <stop offset="65%" stopColor={midColor} />
            <stop offset="100%" stopColor={darkColor} />
          </linearGradient>

          {/* Radial specular overlay: white gloss from top-center */}
          <radialGradient id={`specular-${uid}`} cx="50%" cy="18%" r="55%" fx="50%" fy="18%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Edge glow at leading tip */}
          <radialGradient id={`edgeglow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={highlightColor} stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow filter around the filled arc */}
          <filter id={`glow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={glowColor} floodOpacity="1" />
            <feDropShadow dx="0" dy="1" stdDeviation="5" floodColor={glowColorFaint} floodOpacity="1" />
          </filter>

          {/* Inner shadow filter for the track */}
          <filter id={`trackShadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.22)" floodOpacity="1" />
          </filter>

          {/* Clip path for the progress arc shape — used for specular overlay */}
          <clipPath id={`arcClip-${uid}`}>
            <circle
              {...sharedCircle}
              strokeDasharray={primaryStrokeDasharray()}
              style={{ ...sharedCircle.style, transform: primaryTransform() }}
              strokeWidth={strokeWidth + 0.5}
            />
          </clipPath>
        </defs>

        {/* ── TRACK (background ring) ── */}
        {/* Outer depth shadow ring */}
        <circle
          {...sharedCircle}
          stroke="rgba(0,0,0,0.10)"
          strokeWidth={resolvedTrackWidth + 1.5}
          strokeDasharray={secondaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: secondaryTransform() }}
          opacity={secondaryOpacity()}
        />
        {/* Main track */}
        <circle
          {...sharedCircle}
          stroke={secondaryColor}
          strokeWidth={resolvedTrackWidth}
          strokeDasharray={secondaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: secondaryTransform(), filter: `url(#trackShadow-${uid})` }}
          opacity={secondaryOpacity()}
          className={cn("", typeof className === "object" && (className as any)?.secondaryClassName)}
        />
        {/* Track inner highlight (top edge lit) */}
        <circle
          {...sharedCircle}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
          strokeDasharray={secondaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: secondaryTransform() }}
          opacity={secondaryOpacity()}
        />

        {/* ── PROGRESS ARC — bottom glow layer ── */}
        <circle
          {...sharedCircle}
          stroke={primaryColor}
          strokeWidth={strokeWidth + 3}
          strokeDasharray={primaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: primaryTransform(), filter: `url(#glow-${uid})`, opacity: 0.55 }}
          opacity={primaryOpacity()}
        />

        {/* ── PROGRESS ARC — main 3D gradient arc ── */}
        <circle
          {...sharedCircle}
          stroke={`url(#arcMain-${uid})`}
          strokeDasharray={primaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: primaryTransform() }}
          opacity={primaryOpacity()}
          className={cn("", typeof className === "object" && (className as any)?.primaryClassName)}
        />

        {/* ── PROGRESS ARC — specular gloss overlay (clipped to arc shape) ── */}
        <g clipPath={`url(#arcClip-${uid})`} style={{ transform: primaryTransform(), transformOrigin: "50% 50%" }} opacity={primaryOpacity()}>
          <circle
            {...sharedCircle}
            stroke={`url(#specular-${uid})`}
            strokeDasharray={primaryStrokeDasharray()}
            style={{ ...sharedCircle.style, transform: primaryTransform() }}
          />
        </g>

        {/* ── PROGRESS ARC — top rim light (thin bright inner edge) ── */}
        <circle
          {...sharedCircle}
          stroke="rgba(255,255,255,0.30)"
          strokeWidth={1.2}
          r={radius - strokeWidth / 2 + 1}
          strokeDasharray={primaryStrokeDasharray()}
          style={{ ...sharedCircle.style, transform: primaryTransform() }}
          opacity={primaryOpacity()}
        />

        {/* ── CENTER TEXT ── */}
        {showValue && (
          <text
            x={circleSize / 2}
            y={circleSize / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            alignmentBaseline="central"
            fill="currentColor"
            fontSize={strokeWidth > 12 ? 26 : 30}
            fontWeight="700"
            className={cn("font-bold", typeof className === "object" && (className as any)?.textClassName)}
            style={{ userSelect: "none" }}
          >
            {animatedValue}{showPercentage && unit}
          </text>
        )}
        {label && (
          <text
            x={circleSize / 2}
            y={circleSize / 2 + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fontWeight="400"
            className="fill-muted-foreground"
            style={{ userSelect: "none" }}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  )
}

export function useNumberCounter({ value, direction = "up", delay = 0, decimalPlaces = 0 }: {
  value: number; direction?: "up" | "down"; delay?: number; decimalPlaces?: number
}) {
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : 0)
  const [rawValue, setRawValue] = useState(direction === "down" ? value : 0)
  const [isInView, setIsInView] = useState(false)

  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 })

  useEffect(() => {
    const initialValue = direction === "down" ? value : 0
    setDisplayValue(initialValue)
    setRawValue(initialValue)
  }, [direction, value])

  useEffect(() => {
    const timer = setTimeout(() => setIsInView(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => { motionValue.set(direction === "down" ? 0 : value) }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [motionValue, isInView, delay, value, direction])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Number(latest.toFixed(decimalPlaces)))
      setRawValue(latest)
    })
    return unsubscribe
  }, [springValue, decimalPlaces])

  const formattedDisplayValue = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(displayValue)

  return { formattedValue: formattedDisplayValue, rawValue }
}
