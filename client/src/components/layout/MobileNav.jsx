import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Menu, X, Disc3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Inicio', to: '/', icon: Home },
  { label: 'Buscar', to: '/search', icon: Search },
];

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur-lg md:hidden">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="accent-gradient flex h-8 w-8 items-center justify-center rounded-xl">
            <Disc3 className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">
            ZOCO<span className="text-primary"> Music</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-[57px] z-30 border-b border-white/10 bg-background/98 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map(({ label, to, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium',
                    active
                      ? 'bg-white/10 text-primary'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

export default MobileNav;