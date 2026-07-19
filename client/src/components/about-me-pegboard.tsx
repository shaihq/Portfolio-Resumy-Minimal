"use client";

import { useRef } from "react";
import { motion } from "motion/react";

const PHOTOS = [
  {
    id: "p1",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    tape: "/stickie1.avif",
    rotate: -5,
    top: 40,
    left: "25%",
  },
  {
    id: "p2",
    src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80",
    tape: "/sticky%202.avif",
    rotate: 4,
    top: 260,
    left: "28%",
  },
];

export function AboutMePegboard() {
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={boardRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 480,
        marginBottom: 56,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Half-book background */}
      <img
        src="/halfbook.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          width: "100%",
          display: "block",
          borderRadius: 16,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Right-edge fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "linear-gradient(to right, transparent 55%, white 100%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Draggable photo cards */}
      {PHOTOS.map((photo) => (
        <motion.div
          key={photo.id}
          drag
          dragConstraints={boardRef}
          dragMomentum={false}
          whileDrag={{ scale: 1.06, zIndex: 30 }}
          whileHover={{ scale: 1.02 }}
          style={{
            position: "absolute",
            top: photo.top,
            left: photo.left,
            zIndex: 15,
            cursor: "grab",
            touchAction: "none",
          }}
        >
          {/* Tape image — centered at top of polaroid */}
          <img
            src={photo.tape}
            draggable={false}
            alt=""
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 72,
              zIndex: 20,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          {/* Polaroid frame */}
          <div
            style={{
              background: "white",
              padding: "9px 9px 36px 9px",
              transform: `rotate(${photo.rotate}deg)`,
              boxShadow: "0 8px 28px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.10)",
              width: 155,
            }}
          >
            <img
              src={photo.src}
              draggable={false}
              alt=""
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
