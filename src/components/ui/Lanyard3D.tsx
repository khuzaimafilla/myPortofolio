/**
 * Lanyard3D — Ultra-Realistic Physics ID Card
 * ─────────────────────────────────────────────
 * Physics layers (all via Framer Motion motion values — zero React re-renders):
 *  1. Initial drop + pendulum sway on mount
 *  2. Scroll inertia (useScroll + useVelocity → pitch/offset)
 *  3. Free drag with elastic tension + spring snap-back
 *  4. Dynamic SVG bezier strap (updates every frame)
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  animate,
  type SpringOptions,
} from "framer-motion";

// ─── layout constants ────────────────────────────────────────────────────────
const W            = 320;           // container / SVG width
const ANCHOR_X     = W / 2;         // 160 — top clip X
const ANCHOR_Y     = 18;            // top clip Y (inside SVG)
const STRAP_LEN    = 110;           // resting strap length (px)
const CARD_W       = 280;           // card width
const REST_TOP     = ANCHOR_Y + STRAP_LEN;   // card resting top in SVG coords

// ─── spring presets ──────────────────────────────────────────────────────────
const SNAP_SPRING:     SpringOptions = { type: "spring", stiffness: 300, damping: 18, mass: 1 };
const SCROLL_SPRING:   SpringOptions = { stiffness: 280, damping: 30 };
const PENDULUM_SPRING: SpringOptions = { stiffness: 60,  damping: 8,  mass: 1.2 };

// ─── types ───────────────────────────────────────────────────────────────────
interface LanyardProps {
  name?:             string;
  title?:            string;
  location?:         string;
  specialty?:        string;
  avatarUrl?:        string;
  fallbackAvatarUrl?: string;
}

// ─── SVG Strap path helper ────────────────────────────────────────────────────
function buildPath(
  anchorX: number, anchorY: number,
  cardX: number,  cardY: number,
  dist: number,
): string {
  // sag: droops more sideways, less when pulled straight down
  const dx   = cardX - anchorX;
  const dy   = cardY - anchorY;
  const sag  = Math.max(10, 40 - Math.abs(dy) * 0.2) + dist * 0.045;
  const cpX  = (anchorX + cardX) / 2 + dx * 0.08;
  const cpY  = (anchorY + cardY) / 2 + sag;
  return `M ${anchorX} ${anchorY} Q ${cpX} ${cpY} ${cardX} ${cardY}`;
}

// ─── component ───────────────────────────────────────────────────────────────
export default function Lanyard3D({
  name             = "Khuzaima Filla Januartha",
  title            = "Frontend Web Developer & UI/UX Designer",
  location         = "Surabaya, Indonesia",
  specialty        = "Web & UI Systems",
  avatarUrl        = "/images/profile.png",
  fallbackAvatarUrl = "https://ui-avatars.com/api/?name=Khuzaima+Filla&background=A50044&color=fff&size=256",
}: LanyardProps) {

  // ── drag state ──────────────────────────────────────────────────────────────
  const [isDragging, setIsDragging] = useState(false);

  // raw drag offset (direct user input)
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // ── scroll inertia ──────────────────────────────────────────────────────────
  const { scrollY } = useScroll();
  const scrollVY    = useVelocity(scrollY);

  // spring-smoothed scroll influence
  const scrollInfluenceY = useSpring(
    useTransform(scrollVY, [-3000, 0, 3000], [60, 0, -60]),
    SCROLL_SPRING,
  );
  const scrollPitch = useSpring(
    useTransform(scrollVY, [-3000, 0, 3000], [-18, 0, 18]),
    SCROLL_SPRING,
  );

  // ── pendulum / drop state (spring values, no re-renders) ───────────────────
  const pendulumAngle = useMotionValue(0);   // degrees, pivot = top anchor
  const dropY         = useMotionValue(-320); // starts above viewport

  // smoothed pendulum driven by spring
  const swayAngle = useSpring(pendulumAngle, PENDULUM_SPRING);

  // ── combined 3-D tilt ───────────────────────────────────────────────────────
  // drag tilt
  const dragRotY = useTransform(dragX, [-300, 300], [-22, 22]);
  const dragRotX = useTransform(dragY, [-300, 300],  [16, -16]);

  // final displayed card Y = dragY + scrollInfluenceY + dropY (clamped)
  // We handle dropY separately in the mount animation below

  // ── SVG strap state (updated via motion value subscriptions) ───────────────
  const [pathD,        setPathD]        = useState("");
  const [connectorPos, setConnectorPos] = useState({ x: ANCHOR_X, y: REST_TOP });
  const [strapW,       setStrapW]       = useState(10);

  // ── mount: drop + pendulum ──────────────────────────────────────────────────
  useEffect(() => {
    // Phase 1 — drop from above (gravity-like easing)
    animate(dropY, 0, {
      duration: 0.72,
      ease:     [0.2, 0, 1, 1],    // accelerate in (gravity)
      onComplete: () => {
        // Phase 2 — pendulum sway, decaying
        const swing = async () => {
          await animate(pendulumAngle, 14,  { duration: 0.38, ease: "easeOut" });
          await animate(pendulumAngle, -10, { duration: 0.34, ease: "easeInOut" });
          await animate(pendulumAngle, 6,   { duration: 0.28, ease: "easeInOut" });
          await animate(pendulumAngle, -3,  { duration: 0.24, ease: "easeInOut" });
          await animate(pendulumAngle, 0,   { duration: 0.2,  ease: "easeOut" });
        };
        swing();
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── SVG path rebuild (runs on every frame, zero re-renders for transforms) ──
  useEffect(() => {
    function rebuild() {
      const dx   = dragX.get();
      const dy   = dragY.get();
      const sy   = scrollInfluenceY.get();
      const drop = dropY.get();

      const cardX = ANCHOR_X + dx;
      const cardY = REST_TOP  + dy + sy + drop;
      const dist  = Math.sqrt(dx * dx + (dy + sy) * (dy + sy));

      setPathD(buildPath(ANCHOR_X, ANCHOR_Y, cardX, cardY, dist));
      setConnectorPos({ x: cardX, y: cardY });
      setStrapW(Math.max(5, 10 - dist * 0.013));
    }

    const unsubs = [
      dragX.on("change",            rebuild),
      dragY.on("change",            rebuild),
      scrollInfluenceY.on("change", rebuild),
      dropY.on("change",            rebuild),
      swayAngle.on("change",        rebuild),
    ];
    rebuild();

    return () => unsubs.forEach(u => u());
  }, [dragX, dragY, scrollInfluenceY, dropY, swayAngle]);

  // ── snap back on drag release ────────────────────────────────────────────────
  const onDragEnd = useCallback(
    (_e: unknown, info: { velocity: { x: number; y: number } }) => {
      setIsDragging(false);

      // add a tiny "fling" impulse before snapping back
      const flingX = info.velocity.x * 0.04;
      const flingY = info.velocity.y * 0.04;

      animate(dragX, flingX, { duration: 0.08, ease: "easeOut", onComplete: () =>
        animate(dragX, 0, SNAP_SPRING)
      });
      animate(dragY, flingY, { duration: 0.08, ease: "easeOut", onComplete: () =>
        animate(dragY, 0, SNAP_SPRING)
      });

      // trigger a small pendulum sway on release
      const sway = Math.min(8, Math.abs(info.velocity.x) * 0.012);
      if (sway > 1) {
        animate(pendulumAngle, info.velocity.x > 0 ? sway : -sway, { duration: 0.15 }).then(() =>
          animate(pendulumAngle, 0, { duration: 0.6, ...PENDULUM_SPRING })
        );
      }
    },
    [dragX, dragY, pendulumAngle],
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative select-none"
      style={{ width: `${W}px`, height: "560px", overflow: "visible" }}
    >
      {/* ── SVG Lanyard ───────────────────────────────────────────────────── */}
      <svg
        className="absolute pointer-events-none"
        width={W}
        height="560"
        style={{ overflow: "visible", zIndex: 20, top: 0, left: 0 }}
      >
        <defs>
          {/* gradient follows strap direction */}
          <linearGradient
            id="strapGrad"
            gradientUnits="userSpaceOnUse"
            x1={ANCHOR_X} y1={ANCHOR_Y}
            x2={connectorPos.x} y2={connectorPos.y}
          >
            <stop offset="0%"   stopColor="#A50044" />
            <stop offset="28%"  stopColor="#EDBB00" />
            <stop offset="72%"  stopColor="#EDBB00" />
            <stop offset="100%" stopColor="#A50044" />
          </linearGradient>

          <filter id="strapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* shadow */}
        <path d={pathD} fill="none" stroke="rgba(0,0,0,0.5)"
          strokeWidth={strapW + 5} strokeLinecap="round" />
        {/* main strap */}
        <path d={pathD} fill="none" stroke="url(#strapGrad)"
          strokeWidth={strapW} strokeLinecap="round" filter="url(#strapGlow)" />
        {/* sheen */}
        <path d={pathD} fill="none" stroke="rgba(255,255,255,0.22)"
          strokeWidth={strapW * 0.32} strokeLinecap="round" />

        {/* ── Top anchor clip ── */}
        <g transform={`translate(${ANCHOR_X}, ${ANCHOR_Y})`}>
          <rect x="-11" y="-1" width="22" height="18" rx="4" fill="#475569" />
          <rect x="-8"  y="-10" width="16" height="11" rx="3" fill="#64748b" />
          <circle cx="-4" cy="8" r="2" fill="#334155" />
          <circle cx=" 4" cy="8" r="2" fill="#334155" />
          <rect x="-2" y="-16" width="4" height="7" rx="2" fill="#94a3b8" />
        </g>

        {/* ── Bottom connector ring (tracks card position) ── */}
        <g transform={`translate(${connectorPos.x}, ${connectorPos.y})`}>
          <circle r="7.5" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
          <circle r="4"   fill="#1e293b" />
          <circle r="1.8" fill="#64748b" />
        </g>
      </svg>

      {/* ── Draggable + Physics Card ───────────────────────────────────────── */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.5}
        style={{
          x:                dragX,
          y:                dragY,
          /* 3D tilt: drag + scroll pitch + pendulum sway */
          rotateX:          dragRotX,
          rotateY:          dragRotY,
          rotateZ:          swayAngle,
          /* mount drop offset applied here */
          marginTop:        dropY,
          transformOrigin:  "top center",
          transformPerspective: 1200,
          /* resting position */
          position:   "absolute",
          top:        REST_TOP,
          left:       "50%",
          marginLeft: `-${CARD_W / 2}px`,
          zIndex:     10,
          cursor:     isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
        whileDrag={{ scale: 1.04 }}
      >
        {/* scroll pitch wrapper (separate layer to avoid transform conflicts) */}
        <motion.div style={{ rotateX: scrollPitch, transformOrigin: "top center" }}>
          {/* ── Card body ─────────────────────────────────────────────────── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: `${CARD_W}px`,
              background: "linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(20,30,58,0.97) 100%)",
              boxShadow: isDragging
                ? "0 40px 100px rgba(165,0,68,0.45), 0 0 0 1px rgba(237,187,0,0.3), 0 16px 50px rgba(0,0,0,0.8)"
                : "0 28px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            {/* ambient blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #EDBB00, transparent 70%)" }} />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full opacity-25"
                style={{ background: "radial-gradient(circle, #A50044, transparent 70%)" }} />
            </div>

            {/* ── Header bar ── */}
            <div className="relative px-5 pt-4 pb-2.5 flex items-center justify-between border-b border-white/10">
              <div className="w-8 h-1.5 bg-slate-700/80 rounded-full" />
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono tracking-[0.25em] font-bold uppercase"
                  style={{ color: "#EDBB00" }}>DEVELOPER ID</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "#22c55e" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "#22c55e" }} />
                </span>
              </div>
            </div>

            {/* ── Profile ── */}
            <div className="px-5 pt-5 pb-2 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full p-[2.5px] mb-3 shadow-xl"
                style={{ background: "linear-gradient(135deg, #A50044, #EDBB00, #0f172a)" }}>
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                  style={{ backgroundColor: "#1e293b" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackAvatarUrl; }}
                />
              </div>
              <h3 className="font-heading font-bold text-[15px] text-white leading-tight mb-0.5">{name}</h3>
              <p className="text-[11px] font-medium mb-2.5" style={{ color: "#EDBB00" }}>{title}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
                <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-[10px] text-slate-400 font-mono">{location}</span>
              </div>
            </div>

            {/* divider */}
            <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* ── Footer grid ── */}
            <div className="px-5 py-3 grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Specialty</div>
                <div className="text-[11px] font-semibold text-slate-200">{specialty}</div>
              </div>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Status</div>
                <div className="text-[11px] font-semibold" style={{ color: "#22c55e" }}>Available ✓</div>
              </div>
            </div>

            {/* ── Bottom accent bar ── */}
            <div className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #A50044, #EDBB00, #A50044)" }} />
          </div>

          {/* depth shadow */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-5 blur-xl opacity-40 rounded-full"
            style={{ background: "radial-gradient(ellipse, #A50044, transparent)" }} />
        </motion.div>
      </motion.div>

      {/* hint */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-slate-600 font-mono pointer-events-none">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
        </svg>
        drag me
      </div>
    </div>
  );
}
