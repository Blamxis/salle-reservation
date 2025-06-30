import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Salle Reservation</h1>
      <ul className="flex gap-6">
        <li><Link to="/" className="hover:text-blue-500">Accueil</Link></li>
        <li><Link to="/login" className="hover:text-blue-500">Connexion</Link></li>
        <li><Link to="/register" className="hover:text-blue-500">Inscription</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
