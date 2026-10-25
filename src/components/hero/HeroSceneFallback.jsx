export default function HeroSceneFallback() {
  return (
    <svg className="portfolio-hero__fallback" viewBox="0 0 1440 540" fill="none" aria-hidden="true">
      <defs>
        <pattern id="hero-fallback-grid" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0h12v12" stroke="#aeb5c2" strokeWidth=".45" opacity=".35" />
        </pattern>
        <radialGradient id="hero-fallback-halo">
          <stop stopColor="#fff" stopOpacity=".12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="638" cy="190" r="180" fill="url(#hero-fallback-halo)" />
      <g stroke="#e5e7eb" strokeWidth="2">
        <circle cx="638" cy="190" r="111" fill="#050505" />
        <circle cx="638" cy="190" r="101" />
        <circle cx="638" cy="190" r="91" strokeDasharray="3 4" />
        <text x="638" y="233" textAnchor="middle" fontSize="132" fontFamily="Arial,sans-serif" fill="#f5f5f5" stroke="none">₿</text>
        <path d="M1425 455 945 316 816 325 716 371 620 360 544 286Q530 261 514 274T513 313L555 377 629 413 761 426 874 394 1425 529Z" fill="url(#hero-fallback-grid)" />
        <path d="m626 361-78-123q-13-22-26-11t0 36l56 114m94-17-73-144q-10-24-25-17t-3 35l53 128m97-7-53-139q-8-25-24-19t-8 32l39 131m95-34-49-75q-16-22-29-8t6 33l31 54" />
        <path d="m834 338 541 148m-529-130 553 150m-553-120 530 140" strokeWidth=".8" />
      </g>
    </svg>
  );
}
