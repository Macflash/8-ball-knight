export function ImageEl({ src, size }: { src: string; size: number }) {
  if (!src) return undefined;
  if (src.length < 10) {
    return (
      <div style={{ zIndex: 1, fontSize: size, marginTop: -0.1 * size }}>
        {src}
      </div>
    );
  }

  return <img style={{ zIndex: 1 }} src={src} height={size} />;
}
