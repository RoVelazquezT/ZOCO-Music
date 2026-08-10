import { Link } from 'react-router-dom';

function ArtistCard({ artist, index = 0 }) {
  return (
    <Link
      to={`/artists/${artist.id}`}
      className="animate-rise-in group flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-lg transition-all duration-500 ease-[var(--ease-silk)] hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[var(--shadow-glow)]"
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-secondary">
        {artist.images?.[0]?.url ? (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-2xl font-bold text-foreground/85">
            {artist.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-4 line-clamp-1 text-sm font-bold">{artist.name}</h3>
    </Link>
  );
}

export default ArtistCard;
