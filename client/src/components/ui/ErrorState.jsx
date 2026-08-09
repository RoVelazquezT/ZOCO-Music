function ErrorState({ message = 'No pudimos cargar el contenido.', onRetry }) {
  return (
    <div className="animate-rise-in flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-lg">
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="accent-gradient rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 ease-[var(--ease-silk)] hover:-translate-y-0.5"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorState;
