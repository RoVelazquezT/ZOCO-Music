function EmptyState({ message }) {
  return (
    <div className="animate-rise-in rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-lg">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default EmptyState;
