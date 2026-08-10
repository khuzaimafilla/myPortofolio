import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface LanyardProps {
  name?: string;
  title?: string;
  location?: string;
  specialty?: string;
  avatarUrl?: string;
  fallbackAvatarUrl?: string;
}

// --- Layout constants (px) ---
const CONTAINER_W = 340;
const ANCHOR_X = CONTAINER_W / 2;     // centre of container at the top
const ANCHOR_Y = 0;                    // top of the SVG / clip attachment
const STRAP_LEN = 108;                 // resting strap length

export default function Lanyard3D({
  name = "Khuzaima Filla Januartha",
  title = "Frontend Web Developer & UI/UX Designer",
  location = "Surabaya, Indonesia",
  specialty = "Web & UI Systems",
  avatarUrl = "/images/profile.png",
  fallbackAvatarUrl = "https://ui-avatars.com/api/?name=Khuzaima+Filla&background=A50044&color=fff&size=256",
}: LanyardProps) {

  // ── drag state ──────────────────────────────────────────────────────────────
  const [isDragging, setIsDragging]   = useState(false);

  // drag offsets from resting position
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // ── 3-D tilt based on drag ──────────────────────────────────────────────────
  const rotateY = useTransform(dragX, [-320, 320], [-22, 22]);
  const rotateX = useTransform(dragY, [-320, 320],  [16, -16]);

  // ── SVG lanyard path (updated every frame via MV subscriptions) ─────────────
  const [pathD,        setPathD]        = useState("");
  const [connectorPos, setConnectorPos] = useState({ x: ANCHOR_X, y: ANCHOR_Y + STRAP_LEN });
  const [strapWidth,   setStrapWidth]   = useState(10);

  useEffect(() => {
    function rebuild() {
      const dx = dragX.get();
      const dy = dragY.get();

      // top-centre of card in SVG space
      const cardX = ANCHOR_X + dx;
      const cardY = ANCHOR_Y + STRAP_LEN + dy;

      // stretch distance
      const dist = Math.sqrt(dx * dx + dy * dy);

      // sag: droop less when pulled taut downward, more when pulled sideways
      const sag = Math.max(8, 36 - Math.abs(dy) * 0.18) + dist * 0.04;

      // single quadratic bezier: anchor → card top
      const cpX = (ANCHOR_X + cardX) / 2;
      const cpY = (ANCHOR_Y + cardY) / 2 + sag;

      setPathD(`M ${ANCHOR_X} ${ANCHOR_Y} Q ${cpX} ${cpY} ${cardX} ${cardY}`);
      setConnectorPos({ x: cardX, y: cardY });

      // thin the strap when it's stretched far (visual rubber effect)
      setStrapWidth(Math.max(5, 10 - dist * 0.012));
    }

    const u1 = dragX.on("change", rebuild);
    const u2 = dragY.on("change", rebuild);
    rebuild();                          // draw initial resting state

    return () => { u1(); u2(); };
  }, [dragX, dragY]);

  // ── snap back like a rubber band ────────────────────────────────────────────
  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    animate(dragX, 0, { type: "spring", stiffness: 320, damping: 18, mass: 0.9 });
    animate(dragY, 0, { type: "spring", stiffness: 320, damping: 18, mass: 0.9 });
  }, [dragX, dragY]);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative select-none"
      style={{
        width:    `${CONTAINER_W}px`,
        height:   "520px",
        overflow: "visible",          // card can roam outside the box
      }}
    >
      {/* ── SVG lanyard ────────────────────────────────────────────────── */}
      <svg
        className="absolute pointer-events-none"
        width={CONTAINER_W}
        height="520"
        style={{ overflow: "visible", zIndex: 20, top: 0, left: 0 }}
      >
        <defs>
          {/* gradient along the strap */}
          <linearGradient
            id="strapGrad"
            gradientUnits="userSpaceOnUse"
            x1={ANCHOR_X} y1={ANCHOR_Y}
            x2={connectorPos.x} y2={connectorPos.y}
          >
            <stop offset="0%"   stopColor="#A50044" />
            <stop offset="30%"  stopColor="#EDBB00" />
            <stop offset="70%"  stopColor="#EDBB00" />
            <stop offset="100%" stopColor="#A50044" />
          </linearGradient>

          {/* subtle glow filter */}
          <filter id="strapGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* drop shadow */}
        <path
          d={pathD} fill="none"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth={strapWidth + 4}
          strokeLinecap="round"
        />
        {/* main strap */}
        <path
          d={pathD} fill="none"
          stroke="url(#strapGrad)"
          strokeWidth={strapWidth}
          strokeLinecap="round"
          filter="url(#strapGlow)"
        />
        {/* glossy sheen */}
        <path
          d={pathD} fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={strapWidth * 0.35}
          strokeLinecap="round"
        />

        {/* ── Top anchor clip ── */}
        <g transform={`translate(${ANCHOR_X}, ${ANCHOR_Y})`}>
          {/* hook body */}
          <rect x="-10" y="0" width="20" height="18" rx="4" fill="#475569" />
          {/* hook top bar */}
          <rect x="-7"  y="-9" width="14"  height="11" rx="3" fill="#64748b" />
          {/* screw holes */}
          <circle cx="-4" cy="9"  r="2" fill="#334155" />
          <circle cx=" 4" cy="9"  r="2" fill="#334155" />
          {/* top hook pin */}
          <rect x="-2" y="-15" width="4" height="8" rx="2" fill="#94a3b8" />
        </g>

        {/* ── Bottom connector ring (moves with the card) ── */}
        <g transform={`translate(${connectorPos.x}, ${connectorPos.y})`}>
          <circle r="7"  fill="#475569" stroke="#64748b" strokeWidth="1.5" />
          <circle r="3.5" fill="#1e293b" />
          <circle r="1.5" fill="#64748b" />
        </g>
      </svg>

      {/* ── Draggable ID card ───────────────────────────────────────────── */}
      <motion.div
        drag
        dragMomentum={false}
        style={{
          x: dragX,
          y: dragY,
          rotateX,
          rotateY,
          transformPerspective: 1200,
          position:  "absolute",
          top:       ANCHOR_Y + STRAP_LEN,   // resting top edge
          left:      "50%",
          marginLeft: "-140px",              // half card width = 280/2
          zIndex: 10,
          cursor:    isDragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
        whileDrag={{ scale: 1.04 }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 22 } }}
      >
        {/* ── Card body ─────────────────────────────────────────────────── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: "280px",
            background: "linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(20,30,58,0.97) 100%)",
            boxShadow: isDragging
              ? "0 40px 100px rgba(165,0,68,0.4), 0 0 0 1px rgba(237,187,0,0.25), 0 12px 40px rgba(0,0,0,0.7)"
              : "0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
            transition: "box-shadow 0.25s ease",
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
            {/* clip hole */}
            <div className="w-8 h-1.5 bg-slate-700/80 rounded-full" />
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-[0.25em] font-bold uppercase" style={{ color: "#EDBB00" }}>
                DEVELOPER ID
              </span>
              {/* live pulse */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#22c55e" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#22c55e" }} />
              </span>
            </div>
          </div>

          {/* ── Profile ── */}
          <div className="px-5 pt-5 pb-2 flex flex-col items-center text-center">
            {/* avatar ring */}
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

            {/* name */}
            <h3 className="font-heading font-bold text-[15px] text-white leading-tight mb-0.5">
              {name}
            </h3>

            {/* title */}
            <p className="text-[11px] font-medium mb-2.5" style={{ color: "#EDBB00" }}>
              {title}
            </p>

            {/* location */}
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
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #A50044, #EDBB00, #A50044)" }} />
        </div>

        {/* card shadow depth */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-5 blur-xl opacity-40 rounded-full"
          style={{ background: "radial-gradient(ellipse, #A50044, transparent)" }}
        />
      </motion.div>

      {/* ── Hint label ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono"
        style={{ pointerEvents: "none" }}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
        </svg>
        drag me
      </div>
    </div>
  );
}
