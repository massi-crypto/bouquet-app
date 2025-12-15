import { Link } from "react-router-dom";

function Navbar({ isAuthenticated }) {
  const menuItems = [
    { label: "Home", to: "/home" },
    { label: "Bouquets", to: "/bouquets" },
    { label: "Fleurs", to: "/fleurs" },
    { label: "🛒 Panier", to: "/cart" },
    { label: "Mon compte", to: "/moncompte" },
    (isAuthenticated ? [{ label: "👤 Profil", to: "/profile" }] : []),
    { label: "Backoffice", to: "/backoffice" },
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
            {menuItems.map((item, index) => (
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