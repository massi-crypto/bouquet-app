import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Bouquets from "./pages/bouquets";
import Fleurs from "./pages/fleurs";
import MonCompte from "./pages/moncompte";
import BouquetDetails from "./pages/bouquetsDetails";
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
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/bouquets" element={<Bouquets bouquets={mesBouquets} />} />
          <Route path="/fleurs" element={<Fleurs />} />
          <Route path="/moncompte" element={<MonCompte />} />
          <Route path="/bouquets/:id" element={<BouquetDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
