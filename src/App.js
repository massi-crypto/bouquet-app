import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Bouquets from "./pages/bouquets";
import Fleurs from "./pages/fleurs";
import MonCompte from "./pages/moncompte";
import BouquetDetails from "./pages/bouquetsDetails";
import Backoffice from "./pages/backoffice";
import Profile from "./pages/profile";
import Cart from "./pages/cart";

function App() {
  const [mesBouquets, setMesBouquets] = useState([]);

  useEffect(() => {
    try {
      const storedBouquets = localStorage.getItem("bouquets");

      if (storedBouquets) {
        const data = JSON.parse(storedBouquets);
        setMesBouquets(data);
      } else {
        fetch("http://localhost:5000/api/bouquets")
          .then(res => res.json())
          .then(data => {
            setMesBouquets(data);
            localStorage.setItem("bouquets", JSON.stringify(data));
          });
      }
    } catch (error) {
      console.warn("⚠️ Impossible d'accéder à localStorage :", error.message);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div style={{ marginTop: "80px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/bouquets" element={<Bouquets bouquets={mesBouquets} />} />
            <Route path="/fleurs" element={<Fleurs />} />
            <Route path="/moncompte" element={<MonCompte />} />
            <Route path="/bouquets/:id" element={<BouquetDetails />} />
            <Route path="/backoffice" element={<Backoffice />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;