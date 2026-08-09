function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg ${className}`}
    />
  );
}

export default Skeleton;
