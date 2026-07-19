import { useRef, useEffect, useCallback } from "react"

const BIRD_CONFIGS = [
  { top: '8%',  animation: 'designer-fly-right-one 15s linear 0s infinite',     sprite: 'designer-bird-one'   },
  { top: '14%', animation: 'designer-fly-right-two 16s linear 1s infinite',     sprite: 'designer-bird-two'   },
  { top: '22%', animation: 'designer-fly-right-one 14.6s linear 9.5s infinite', sprite: 'designer-bird-three' },
  { top: '30%', animation: 'designer-fly-right-two 16s linear 10.25s infinite', sprite: 'designer-bird-four'  },
]

const REPEL_RADIUS = 130 // px — cursor distance that triggers scatter
const MAX_SCATTER  = 70  // px — maximum push at zero distance

export function DesignerBirds() {
  const dayRefs   = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const nightRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const fleeing   = useRef<boolean[]>([false, false, false, false])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const mx = e.clientX
    const my = e.clientY

    dayRefs.current.forEach((dayEl, i) => {
      if (!dayEl) return
      const nightEl = nightRefs.current[i]

      // Use day element rect — it's always in DOM regardless of theme
      const rect = dayEl.getBoundingClientRect()
      const bx = rect.left + rect.width  / 2
      const by = rect.top  + rect.height / 2
      const dx = bx - mx
      const dy = by - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      const applyTransform = (el: HTMLDivElement | null, tx: number, ty: number, fast: boolean) => {
        if (!el) return
        el.style.transition = fast
          ? 'transform 0.07s cubic-bezier(0.2, 0, 0.5, 1)'
          : 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)'
        el.style.transform = tx === 0 && ty === 0
          ? ''
          : `translate(${tx}px, ${ty}px)`
      }

      if (dist < REPEL_RADIUS) {
        const strength = (1 - dist / REPEL_RADIUS) ** 1.4  // non-linear — closer = much stronger
        const push = strength * MAX_SCATTER
        const nx = dist > 0 ? dx / dist : 0
        const ny = dist > 0 ? dy / dist : -1
        fleeing.current[i] = true
        applyTransform(dayEl,   nx * push, ny * push, true)
        applyTransform(nightEl, nx * push, ny * push, true)
      } else if (fleeing.current[i]) {
        fleeing.current[i] = false
        applyTransform(dayEl,   0, 0, false)
        applyTransform(nightEl, 0, 0, false)
      }
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  return (
    <>
      {/* Day birds */}
      <div className="absolute inset-0 pointer-events-none dark:opacity-0 transition-opacity duration-700" aria-hidden="true">
        {BIRD_CONFIGS.map((cfg, i) => (
          <div
            key={i}
            style={{ position: 'absolute', top: cfg.top, left: '-3%', willChange: 'transform', animation: cfg.animation }}
          >
            {/* scatter wrapper — transform applied here, separate from fly-right */}
            <div ref={el => { dayRefs.current[i] = el }}>
              <div className={`designer-bird designer-bird-day ${cfg.sprite}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Night birds */}
      <div className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700" aria-hidden="true">
        {BIRD_CONFIGS.map((cfg, i) => (
          <div
            key={i}
            style={{ position: 'absolute', top: cfg.top, left: '-3%', willChange: 'transform', animation: cfg.animation }}
          >
            <div ref={el => { nightRefs.current[i] = el }}>
              <div className={`designer-bird designer-bird-night ${cfg.sprite}`} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
