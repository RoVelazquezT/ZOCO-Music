import { useState } from 'react';
import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

import { cn } from '../../lib/utils';
import { usePlayer } from '../../features/player/PlayerContext';

function formatTime(ms) {
  if (!ms || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function Player() {
  const { currentTrack, isPlaying, progress, dispatch } = usePlayer();
  const [volume, setVolume] = useState(70);

  if (!currentTrack) return null;

  const artistName = currentTrack.artists?.[0]?.name;
  const artworkUrl = currentTrack.album?.images?.[2]?.url ?? currentTrack.album?.images?.[0]?.url;
  const progressPercent = currentTrack.duration_ms
    ? (progress / currentTrack.duration_ms) * 100
    : 0;

  return (
    <footer className="glass-panel fixed inset-x-0 bottom-0 z-50 h-[88px] w-full border-x-0 border-b-0 px-4 md:px-6">
      <div className="flex h-full items-center gap-4">
        {/* Pista actual */}
        <div className="flex min-w-0 items-center gap-3 md:w-1/4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary">
            {artworkUrl ? (
              <img
                src={artworkUrl}
                alt={currentTrack.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="accent-gradient h-full w-full opacity-90" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentTrack.name}</p>
            <p className="truncate text-xs text-muted-foreground">{artistName}</p>
          </div>
          <button
            aria-label="Guardar en favoritos"
            className="ml-1 hidden text-muted-foreground transition-colors duration-300 ease-[var(--ease-silk)] hover:text-primary sm:block"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Controles */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button
              aria-label="Aleatorio"
              className="hidden text-muted-foreground transition-colors duration-300 hover:text-foreground sm:block"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              aria-label="Anterior"
              aria-disabled="true"
              className="text-muted-foreground opacity-30 cursor-not-allowed transition-colors duration-300 hover:text-foreground"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              onClick={() => dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })}
              className="accent-gradient flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 ease-[var(--ease-silk)] hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <button
              aria-label="Siguiente"
              aria-disabled="true"
              className="text-muted-foreground opacity-30 cursor-not-allowed transition-colors duration-300 hover:text-foreground"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              aria-label="Repetir"
              className="hidden text-muted-foreground transition-colors duration-300 hover:text-foreground sm:block"
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden w-full max-w-xl items-center gap-3 sm:flex">
            <span className="w-9 text-right text-[11px] tabular-nums text-muted-foreground">
              {formatTime(progress)}
            </span>
            <RangeBar
              value={progressPercent}
              onChange={() => {}}
              label="Progreso de la canción"
              disabled
            />
            <span className="w-9 text-[11px] tabular-nums text-muted-foreground">
              {formatTime(currentTrack.duration_ms)}
            </span>
          </div>
        </div>

        {/* Volumen */}
        <div className="hidden items-center gap-2 md:flex md:w-1/5">
          <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <RangeBar value={volume} onChange={setVolume} label="Volumen" />
        </div>
      </div>
    </footer>
  );
}

function RangeBar({ value, onChange, label, disabled = false }) {
  return (
    <label className="group relative flex h-4 w-full items-center">
      <span className="sr-only">{label}</span>
      <span className="h-1 w-full overflow-hidden rounded-full bg-secondary">
        <span
          className={cn(
            'accent-gradient block h-full rounded-full transition-[width] duration-300 ease-[var(--ease-silk)]'
          )}
          style={{ width: `${value}%` }}
        />
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label={label}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
    </label>
  );
}

export default Player;
