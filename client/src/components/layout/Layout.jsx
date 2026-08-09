import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {/* Espacio reservado para el player persistente (features/player) */}
      <div className="h-20 border-t border-gray-800" />
    </div>
  );
}

export default Layout;
