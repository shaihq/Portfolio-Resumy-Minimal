import * as React from "react";
import {
  LayoutGroup,
  motion,
  useAnimate,
} from "motion/react";
import type { Transition } from "motion/react";

interface OrbitItem {
  id: number;
  name: string;
  color: string;
  letter: string;
}

interface RadialIntroProps {
  orbitItems: OrbitItem[];
  stageSize?: number;
  imageSize?: number;
}

const transition: Transition = {
  delay: 0,
  stiffness: 300,
  damping: 35,
  type: "spring",
  restSpeed: 0.01,
  restDelta: 0.01,
};

const spinConfig = {
  duration: 28,
  ease: "linear" as const,
  repeat: Infinity,
};

const qsa = (root: Element, sel: string) =>
  Array.from(root.querySelectorAll(sel));

const angleOf = (el: Element) => Number((el as HTMLElement).dataset.angle || 0);

const armOfLogo = (logo: Element) =>
  (logo as HTMLElement).closest("[data-arm]") as HTMLElement | null;

export function RadialIntro({
  orbitItems,
  stageSize = 380,
  imageSize = 44,
}: RadialIntroProps) {
  const step = 360 / orbitItems.length;
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const arms = qsa(root, "[data-arm]");
    const logos = qsa(root, "[data-arm-logo]");
    const stops: Array<() => void> = [];

    // lift logos up from center to top of arm
    setTimeout(() => animate(logos, { top: 0 }, transition), 250);

    // place arms at their orbit angles, counter-rotate logos to stay upright
    const placementSequence = [
      ...arms.map((el) => [el, { rotate: angleOf(el) }, { ...transition, at: 0 }]),
      ...logos.map((logo) => [logo, { rotate: -angleOf(armOfLogo(logo)!), opacity: 1 }, { ...transition, at: 0 }]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any;
    setTimeout(() => animate(placementSequence), 700);

    // continuous spin
    setTimeout(() => {
      arms.forEach((el) => {
        const angle = angleOf(el);
        const ctrl = animate(el, { rotate: [angle, angle + 360] }, spinConfig);
        stops.push(() => ctrl.cancel());
      });
      logos.forEach((logo) => {
        const arm = armOfLogo(logo);
        const angle = arm ? angleOf(arm) : 0;
        const ctrl = animate(logo, { rotate: [-angle, -angle - 360] }, spinConfig);
        stops.push(() => ctrl.cancel());
      });
    }, 1300);

    return () => stops.forEach((stop) => stop());
  }, []);

  return (
    <LayoutGroup>
      <motion.div
        ref={scope}
        className="relative overflow-visible pointer-events-none"
        style={{ width: stageSize, height: stageSize }}
        initial={false}
      >
        {orbitItems.map((item, i) => (
          <motion.div
            key={item.id}
            data-arm
            className="will-change-transform absolute inset-0"
            style={{ zIndex: orbitItems.length - i }}
            data-angle={i * step}
            layoutId={`arm-${item.id}`}
          >
            <motion.div
              data-arm-logo
              className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-bold shadow-md"
              style={{
                width: imageSize,
                height: imageSize,
                fontSize: imageSize * 0.36,
                backgroundColor: item.color,
                opacity: i === 0 ? 1 : 0,
              }}
              layoutId={`arm-logo-${item.id}`}
            >
              {item.letter}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  );
}
