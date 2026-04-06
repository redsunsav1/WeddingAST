import React from 'react';
import { cn } from '../lib/utils';

interface OrnamentProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function KhokhlomaFloral({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 100" fill="currentColor" className={cn("text-folk-red", className)} {...props}>
      <path d="M100,50 Q120,20 150,30 Q180,40 170,70 Q160,100 130,80 Q100,60 100,50 Z" />
      <path d="M100,50 Q80,20 50,30 Q20,40 30,70 Q40,100 70,80 Q100,60 100,50 Z" />
      <path d="M100,50 Q100,10 130,0 Q160,-10 150,20 Q140,50 100,50 Z" />
      <path d="M100,50 Q100,10 70,0 Q40,-10 50,20 Q60,50 100,50 Z" />
      <circle cx="100" cy="50" r="10" />
      <path d="M120,40 Q140,10 160,20" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M80,40 Q60,10 40,20" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="160" cy="20" r="4" />
      <circle cx="40" cy="20" r="4" />
    </svg>
  );
}

export function KhokhlomaSide({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 100 200" fill="currentColor" className={cn("text-folk-red", className)} {...props}>
      <path d="M0,100 Q40,60 20,20 Q0,-20 40,0 Q80,20 60,60 Q40,100 0,100 Z" />
      <path d="M0,100 Q40,140 20,180 Q0,220 40,200 Q80,180 60,140 Q40,100 0,100 Z" />
      <circle cx="20" cy="100" r="8" />
    </svg>
  );
}

export function HeartOrnament({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={cn("text-folk-red", className)} {...props}>
      <path d="M50,90 Q10,50 10,30 Q10,10 30,10 Q50,10 50,30 Q50,10 70,10 Q90,10 90,30 Q90,50 50,90 Z" />
      <path d="M50,30 Q50,40 40,50 Q30,60 30,70" fill="none" stroke="white" strokeWidth="2" />
      <path d="M50,30 Q50,40 60,50 Q70,60 70,70" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function BottomBorder({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 40" fill="currentColor" className={cn("w-full h-10 text-folk-red", className)} preserveAspectRatio="none" {...props}>
      <pattern id="cross-stitch-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="20" height="20" fill="white" />
        {/* Cross stitch 'X' shapes */}
        <path d="M2,2 L8,8 M8,2 L2,8" stroke="#A50000" strokeWidth="1.5" />
        <path d="M12,12 L18,18 M18,12 L12,18" stroke="#A50000" strokeWidth="1.5" />
        <path d="M12,2 L18,8 M18,2 L12,8" stroke="#A50000" strokeWidth="1.5" />
        <path d="M2,12 L8,18 M8,12 L2,18" stroke="#A50000" strokeWidth="1.5" />
      </pattern>
      <rect x="0" y="0" width="100%" height="40" fill="url(#cross-stitch-pattern)" />
      <rect x="0" y="0" width="100%" height="2" fill="#A50000" />
      <rect x="0" y="38" width="100%" height="2" fill="#A50000" />
    </svg>
  );
}

export function SlavicWeaving({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 100 400" fill="currentColor" className={cn("text-folk-red", className)} {...props}>
      <pattern id="weaving-pattern" x="0" y="0" width="100" height="200" patternUnits="userSpaceOnUse">
        {/* Horse-like shape 1 */}
        <path d="M30,40 Q40,20 60,30 Q80,40 70,60 Q60,80 40,70 Q20,60 30,40 Z" />
        <path d="M70,40 Q60,20 40,30 Q20,40 30,60 Q40,80 60,70 Q80,60 70,40 Z" />
        {/* Intricate floral/geometric bits */}
        <rect x="45" y="80" width="10" height="10" />
        <path d="M10,90 L90,90 L50,130 Z" opacity="0.5" />
        <circle cx="50" cy="150" r="15" />
        <path d="M50,135 L65,150 L50,165 L35,150 Z" fill="white" />
        {/* Side accents */}
        <path d="M0,0 L20,20 M100,0 L80,20 M0,200 L20,180 M100,200 L80,180" stroke="currentColor" strokeWidth="2" />
        <rect x="0" y="95" width="10" height="10" />
        <rect x="90" y="95" width="10" height="10" />
      </pattern>
      <rect x="0" y="0" width="100" height="100%" fill="url(#weaving-pattern)" />
    </svg>
  );
}

export function SlavicHorizontalBorder({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 1000 64" fill="currentColor" className={cn("w-full h-16 text-folk-red", className)} preserveAspectRatio="none" shapeRendering="crispEdges" {...props}>
      <pattern id="slavic-h-pixel-v4" x="0" y="0" width="128" height="64" patternUnits="userSpaceOnUse">
        {/* Top and bottom solid lines */}
        <rect x="0" y="0" width="128" height="4" />
        <rect x="0" y="60" width="128" height="4" />
        
        {/* Intricate Diamond Pattern */}
        {/* Center Diamond */}
        <rect x="60" y="28" width="8" height="8" />
        <rect x="52" y="20" width="8" height="8" />
        <rect x="68" y="20" width="8" height="8" />
        <rect x="52" y="36" width="8" height="8" />
        <rect x="68" y="36" width="8" height="8" />
        <rect x="44" y="12" width="8" height="8" />
        <rect x="76" y="12" width="8" height="8" />
        <rect x="44" y="44" width="8" height="8" />
        <rect x="76" y="44" width="8" height="8" />
        
        {/* Connecting bits */}
        <rect x="0" y="28" width="16" height="8" />
        <rect x="112" y="28" width="16" height="8" />
        
        {/* Side ornaments */}
        <rect x="24" y="20" width="8" height="8" />
        <rect x="24" y="36" width="8" height="8" />
        <rect x="96" y="20" width="8" height="8" />
        <rect x="96" y="36" width="8" height="8" />
        
        {/* Small dots */}
        <rect x="16" y="12" width="4" height="4" />
        <rect x="108" y="12" width="4" height="4" />
        <rect x="16" y="48" width="4" height="4" />
        <rect x="108" y="48" width="4" height="4" />
      </pattern>
      <rect x="0" y="0" width="100%" height="64" fill="url(#slavic-h-pixel-v4)" />
    </svg>
  );
}

export function SlavicVerticalBorder({ className, ...props }: OrnamentProps) {
  return (
    <svg viewBox="0 0 64 1000" fill="currentColor" className={cn("text-folk-red", className)} shapeRendering="crispEdges" {...props}>
      <pattern id="slavic-v-pixel-v4" x="0" y="0" width="64" height="128" patternUnits="userSpaceOnUse">
        {/* Side solid lines */}
        <rect x="0" y="0" width="4" height="128" />
        <rect x="60" y="0" width="4" height="128" />
        
        {/* Vertical Diamond Pattern */}
        <rect x="28" y="60" width="8" height="8" />
        <rect x="20" y="52" width="8" height="8" />
        <rect x="36" y="52" width="8" height="8" />
        <rect x="20" y="68" width="8" height="8" />
        <rect x="36" y="68" width="8" height="8" />
        <rect x="12" y="44" width="8" height="8" />
        <rect x="44" y="44" width="8" height="8" />
        <rect x="12" y="76" width="8" height="8" />
        <rect x="44" y="76" width="8" height="8" />
        
        {/* Connecting bits */}
        <rect x="28" y="0" width="8" height="16" />
        <rect x="28" y="112" width="8" height="16" />
      </pattern>
      <rect x="0" y="0" width="64" height="100%" fill="url(#slavic-v-pixel-v4)" />
    </svg>
  );
}

