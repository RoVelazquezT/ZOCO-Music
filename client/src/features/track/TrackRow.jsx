import { Heart, Pause, Play } from 'lucide-react';

import { cn } from '../../lib/utils';
import { formatTime } from '../../utils/formatTime';

function TrackRow({
  track,
  index = 0,
  showIndex = false,
  isPlaying = false,
  onPlay,
  isFavorite = false,
  onToggleFavorite,
}) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlay(track);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPlay(track)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ease-[var(--ease-silk)] hover:bg-white/5',
        isPlaying && 'bg-white/5'
      )}
    >
      <span className="flex w-6 shrink-0 items-center justify-center">
        {isPlaying ? (
          <Pause className="h-4 w-4 text-primary" />
        ) : showIndex ? (
          <span className="text-sm tabular-nums text-muted-foreground">{index + 1}</span>
        ) : (
          <Play className="h-4 w-4 text-muted-foreground" />
        )}
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className={cn(
            'truncate text-sm font-medium',
            isPlaying ? 'text-primary' : 'text-foreground'
          )}
        >
          {track.name}
        </span>
        {track.explicit && (
          <span className="shrink-0 rounded bg-white/10 px-1 text-[10px] font-bold leading-4 text-muted-foreground">
            E
          </span>
        )}
      </span>

      <button
        type="button"
        aria-label={
          isFavorite ? `Quitar ${track.name} de favoritos` : `Agregar ${track.name} a favoritos`
        }
        aria-pressed={isFavorite}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(track);
        }}
        className={cn(
          'shrink-0 text-muted-foreground transition-colors duration-300 ease-[var(--ease-silk)] hover:text-primary',
          isFavorite && 'text-primary'
        )}
      >
        <Heart className={cn('h-4 w-4', isFavorite && 'fill-primary')} />
      </button>

      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatTime(track.duration_ms)}
      </span>
    </div>
  );
}

export default TrackRow;
