import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBouquets, toggleLike } from "../store/bouquetsSlice";
import { myFetch } from "../comm/MyFetch";

function Bouquets() {
  const bouquets = useSelector((state) => state.bouquets.list);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  // Charger les bouquets au montage
  useEffect(() => {
    myFetch("/bouquets").then((data) => {
      dispatch(setBouquets(data));
      localStorage.setItem("bouquets", JSON.stringify(data));
    });
  }, [dispatch]);

  // Polling automatique toutes les 60s
  useEffect(() => {
    const interval = setInterval(() => {
      myFetch("/bouquets").then((data) => {
        dispatch(setBouquets(data));
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleAddToCart = async (bouquetId) => {
    try {
      await myFetch("/cart/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bouquetId, quantity: 1 })
      });
      
      setMessage("✅ Ajouté au panier !");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Erreur ajout panier:", error);
      setMessage("❌ Erreur lors de l'ajout");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Nos Bouquets 💐</h1>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      <div className="row">
        {bouquets.map((bq) => (
          <div key={bq.id} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <img
                src={bq.image}
                alt={bq.name}
                className="card-img-top"
                style={{ 
                  height: "250px", 
                  objectFit: "cover",
                  cursor: "pointer"
                }}
                onClick={() => (window.location.href = `/bouquets/${bq.id}`)}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{bq.name}</h5>
                <p className="card-text flex-grow-1">{bq.description}</p>
                <p className="fw-bold text-primary fs-5">{bq.price} DA</p>

                <div className="d-flex gap-2">
                  <button
                    className={`btn ${bq.liked ? "btn-danger" : "btn-outline-danger"} flex-fill`}
                    onClick={() => dispatch(toggleLike(bq.id))}
                  >
                    {bq.liked ? "💔 Unlike" : "❤️ Like"}
                  </button>

                  <button
                    className="btn btn-success flex-fill"
                    onClick={() => handleAddToCart(bq.id)}
                  >
                    🛒 Acheter
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bouquets;