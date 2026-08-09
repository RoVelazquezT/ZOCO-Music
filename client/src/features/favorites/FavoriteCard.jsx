import { Play } from 'lucide-react';

function FavoriteCard({ item, index = 0 }) {
  const isArtist = item.variant === 'artist';

  return (
    <article
      className="animate-rise-in group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-lg transition-all duration-500 ease-[var(--ease-silk)] hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[var(--shadow-glow)]"
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="relative">
        <div className="accent-gradient absolute -inset-1 rounded-full opacity-0 blur-lg transition-opacity duration-500 ease-[var(--ease-silk)] group-hover:opacity-40" />
        <div
          className={`relative mx-auto overflow-hidden border border-white/10 bg-secondary ${isArtist ? 'h-32 w-32 rounded-full' : 'h-36 w-36 rounded-2xl'}`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-3xl font-bold text-foreground/85">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label={`Reproducir ${item.name}`}
          className="accent-gradient absolute bottom-1 right-1 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full text-primary-foreground opacity-0 shadow-[var(--shadow-glow)] transition-all duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Play className="ml-0.5 h-4 w-4" />
        </button>
      </div>

      <h3 className="mt-5 line-clamp-1 text-base font-bold">{item.name}</h3>
      {item.subtitle && (
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {item.subtitle}
        </p>
      )}
    </article>
  );
}

export default FavoriteCard;
