/* Decorative volumetric glow — the portrait's studio lamp, reused behind
   headings and surfaces. Pure CSS (see .glow-blob in globals.css). */

export default function GlowBlob({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div aria-hidden="true" className={`glow-blob ${className}`} style={style} />;
}
