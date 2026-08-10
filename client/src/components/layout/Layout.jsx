import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Player from './Player';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileNav />
      <main className="min-h-screen flex-1 px-0 pb-[88px] pt-[57px] md:pt-0">
        {children}
      </main>
      <Player />
    </div>
  );
}

export default Layout;