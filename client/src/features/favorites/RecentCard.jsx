import { Play } from 'lucide-react';

function RecentCard({ item, index = 0, onPlay }) {
  const imageUrl = item.album?.images?.[0]?.url;

  return (
    <article
      onClick={() => onPlay(item)}
      className="group flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl bg-white/5 p-0 backdrop-blur-sm transition-all duration-500 ease-[var(--ease-silk)] hover:bg-white/[0.08] hover:shadow-[var(--shadow-glow)]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-xl font-bold text-foreground/85">
            {item.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-4">
        <h3 className="truncate text-sm font-semibold text-foreground">{item.name}</h3>
      </div>

      <button
        type="button"
        aria-label={`Reproducir ${item.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onPlay(item);
        }}
        className="accent-gradient mr-4 flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-full text-primary-foreground opacity-0 shadow-[var(--shadow-glow)] transition-all duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Play className="ml-0.5 h-4 w-4" />
      </button>
    </article>
  );
}

export default RecentCard;
