import { Pause, Play } from 'lucide-react';

import { cn } from '../../lib/utils';
import { formatTime } from '../../utils/formatTime';

function TrackRow({ track, index = 0, showIndex = false, isPlaying = false, onPlay }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(track)}
      className={cn(
        'group flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors duration-300 ease-[var(--ease-silk)] hover:bg-white/5',
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
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-sm font-medium',
          isPlaying ? 'text-primary' : 'text-foreground'
        )}
      >
        {track.name}
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatTime(track.duration_ms)}
      </span>
    </button>
  );
}

export default TrackRow;
