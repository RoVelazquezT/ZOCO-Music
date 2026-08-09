import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex items-center gap-4 border-b border-gray-800 p-4">
      <Link to="/" className="font-bold">
        ZOCO Music
      </Link>
      <Link to="/search">Buscar</Link>
    </nav>
  );
}

export default Navbar;
