import React from 'react';

const artwork = {
  route: <><circle cx="14" cy="48" r="6"/><circle cx="50" cy="16" r="6"/><path d="M20 48h18a8 8 0 000-16H26a8 8 0 010-16h18" strokeDasharray="4 5"/></>,
  market: <path d="M8 26l5-14h38l5 14M8 26h48v4a7 7 0 01-12 5 7 7 0 01-12 0 7 7 0 01-12 0A7 7 0 018 30zM12 36v18h40V36M26 54V42h12v12"/>,
  sofa: <path d="M14 28v-8a6 6 0 016-6h24a6 6 0 016 6v8M8 32a5 5 0 0110 0v6h28v-6a5 5 0 0110 0v14H8zM14 46v6M50 46v6"/>,
  scooter: <><circle cx="14" cy="46" r="7"/><circle cx="50" cy="46" r="7"/><path d="M21 46h18l6-22h-8M45 24l5 22M34 14l3 10M14 46l8-10h12M28 24l3-8M26 30l2-6"/></>,
  plane: <path d="M58 10L6 30l18 6 4 18 8-12 12 8z M24 36l34-26"/>,
  shield: <path d="M32 6l20 8v16c0 13-9 22-20 26-11-4-20-13-20-26V14zM23 32l7 7 12-14"/>,
  container: <path d="M6 20h52v28H6zM14 24v20M22 24v20M30 24v20M38 24v20M46 24v20M52 24v20M20 20l12-10 12 10"/>,
  doc: <><path d="M16 6h22l12 12v40H16zM38 6v12h12M24 32h18M24 40h18M24 48h10"/><circle cx="46" cy="48" r="9"/><path d="M43 48h6M46 45v6"/></>,
  bulb: <path d="M24 46h16M26 54h12M32 8a16 16 0 00-9 29v9h18v-9A16 16 0 0032 8zM32 2h.01M10 24H4M60 24h-6M14 8l-4-4M50 8l4-4"/>,
};

export function CoverIcon({ name }) {
  const rounded = !['market', 'sofa', 'plane', 'container'].includes(name);
  return <svg className="cover-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap={rounded ? 'round' : undefined} strokeLinejoin="round" aria-hidden="true">{artwork[name]}</svg>;
}
