import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated } = useAuth();

  // Fonctions demandées dans l'exercice
  const isAuthenticatedFunc = () => {
    return isAuthenticated;
  };

  const whoIsAuthenticated = () => {
    return isAuthenticated && user ? user.nomComplet : "Mon Compte";
  };

  const publicMenuItems = [
    { label: "Home", to: "/home" },
    { label: "Bouquets", to: "/bouquets" },
    { label: "Fleurs", to: "/fleurs" },
  ];

  const authMenuItems = isAuthenticatedFunc() ? [
    { label: "🛒 Panier", to: "/cart" },
    { label: `👤 ${whoIsAuthenticated()}`, to: "/profile" },
  ] : [
    { label: whoIsAuthenticated(), to: "/moncompte" },
  ];

  const adminMenuItem = (isAuthenticated && user?.role === 'admin') || 
                        (isAuthenticated && user?.role === 'employee') ? 
    { label: "⚙️ Backoffice", to: "/backoffice" } : null;

  const allMenuItems = [
    ...publicMenuItems,
    ...authMenuItems,
    ...(adminMenuItem ? [adminMenuItem] : [])
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/home">
          🌸 Bouquets Express
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {allMenuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={item.to}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;