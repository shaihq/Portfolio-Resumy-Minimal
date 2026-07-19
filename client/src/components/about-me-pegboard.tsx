"use client";

import { useRef } from "react";
import { motion } from "motion/react";

const PHOTOS = [
  {
    id: "p1",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    note: "deep in figma mode ✦",
    noteRotate: -3,
    rotate: -4,
    top: "16%",
    left: "7%",
  },
  {
    id: "p2",
    src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80",
    note: "coffee is fuel ☕",
    noteRotate: 2,
    rotate: 3,
    top: "10%",
    left: "37%",
  },
  {
    id: "p3",
    src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    note: "shipped it! 🎉",
    noteRotate: -1,
    rotate: -2,
    top: "18%",
    left: "64%",
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
        marginBottom: 56,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Half-book / pegboard background */}
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

      {/* Draggable photo cards */}
      {PHOTOS.map((photo) => (
        <motion.div
          key={photo.id}
          drag
          dragConstraints={boardRef}
          dragMomentum={false}
          whileDrag={{ scale: 1.06, zIndex: 30 }}
          style={{
            position: "absolute",
            top: photo.top,
            left: photo.left,
            zIndex: 5,
            cursor: "grab",
            touchAction: "none",
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Sticky note */}
          <div
            style={{
              background: "#FFF176",
              padding: "5px 11px",
              marginBottom: 5,
              display: "inline-block",
              transform: `rotate(${photo.noteRotate}deg)`,
              fontFamily: "'Caveat', cursive",
              fontSize: 15,
              color: "#333",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              whiteSpace: "nowrap",
            }}
          >
            {photo.note}
          </div>

          {/* Polaroid frame */}
          <div
            style={{
              background: "white",
              padding: "9px 9px 36px 9px",
              transform: `rotate(${photo.rotate}deg)`,
              boxShadow:
                "0 8px 28px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.10)",
              width: 165,
              display: "block",
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
