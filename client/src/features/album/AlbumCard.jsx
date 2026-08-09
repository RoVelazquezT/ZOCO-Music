import { Link } from 'react-router-dom';

function AlbumCard({ album, index = 0 }) {
  return (
    <Link
      to={`/albums/${album.id}`}
      className="animate-rise-in group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-lg transition-all duration-500 ease-[var(--ease-silk)] hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[var(--shadow-glow)]"
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-secondary">
        {album.images?.[0]?.url ? (
          <img
            src={album.images[0].url}
            alt={album.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--primary-glow)_75%,transparent),color-mix(in_oklab,var(--primary)_25%,transparent)_70%)] font-display text-2xl font-bold text-foreground/85">
            {album.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-4 line-clamp-1 text-sm font-bold">{album.name}</h3>
    </Link>
  );
}

export default AlbumCard;
