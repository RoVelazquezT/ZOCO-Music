import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Disc3 } from 'lucide-react';

import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Inicio', to: '/', icon: Home },
  { label: 'Buscar', to: '/search', icon: Search },
];

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-sidebar-border bg-sidebar px-5 pb-[104px] pt-7 md:flex">
      <Link to="/" className="flex items-center gap-3">
        <span className="accent-gradient flex h-10 w-10 items-center justify-center rounded-2xl shadow-[var(--shadow-glow)]">
          <Disc3 className="h-5 w-5 text-primary-foreground" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">
          ZOCO<span className="text-primary"> Music</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-silk)]',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              <span
                className={cn(
                  'accent-gradient absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-opacity duration-300',
                  active ? 'opacity-100' : 'opacity-0'
                )}
              />
              <Icon
                className={cn(
                  'h-[18px] w-[18px] transition-colors duration-300',
                  active && 'text-primary'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="glass-panel mt-auto rounded-2xl p-4">
        <p className="font-display text-sm font-semibold">Tu biblioteca</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Guardá artistas y álbumes en favoritos para encontrarlos al instante.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
