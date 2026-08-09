import Sidebar from './Sidebar';
import Player from './Player';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-h-screen flex-1 pb-[88px]">{children}</main>
      <Player />
    </div>
  );
}

export default Layout;
