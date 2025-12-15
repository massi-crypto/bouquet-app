import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBouquets, toggleLike } from "../store/bouquetsSlice";
import { myFetch } from "../comm/MyFetch";
import { useAuth } from "../context/AuthContext";

function Bouquets() {
  const bouquets = useSelector((state) => state.bouquets.list);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [showLikersModal, setShowLikersModal] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadBouquets();
  }, []);

  const loadBouquets = async () => {
    try {
      const data = await myFetch("/bouquets");
      dispatch(setBouquets(data));
    } catch (error) {
      console.error("Erreur chargement bouquets:", error);
    }
  };

  const handleLike = async (bouquetId) => {
    if (!isAuthenticated) {
      setMessage("⚠️ Vous devez être connecté pour liker un bouquet");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      await myFetch("/users/like", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bouquetId })
      });
      
      loadBouquets();
      setMessage("✅ Like ajouté !");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Erreur like:", error);
    }
  };

  const handleUnlike = async (bouquetId) => {
    try {
      await myFetch("/users/unlike", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, bouquetId })
      });
      
      loadBouquets();
      setMessage("Like retiré");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Erreur unlike:", error);
    }
  };

  const showLikers = async (bouquetId) => {
    try {
      const data = await myFetch(`/bouquets/${bouquetId}/likers`);
      setShowLikersModal(data);
    } catch (error) {
      console.error("Erreur chargement likers:", error);
    }
  };

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
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Nos Bouquets 💐</h1>

      {message && (
        <div className="alert alert-info alert-dismissible fade show">
          {message}
          <button className="btn-close" onClick={() => setMessage("")}></button>
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
                style={{ height: "250px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => (window.location.href = `/bouquets/${bq.id}`)}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{bq.name}</h5>
                <p className="card-text flex-grow-1">{bq.description}</p>
                
                {/* Prix visible seulement si authentifié */}
                {isAuthenticated && (
                  <p className="fw-bold text-primary fs-5">{bq.price} DA</p>
                )}

                <div className="d-flex gap-2 align-items-center mb-2">
                  <button
                    className={`btn flex-fill ${
                      !isAuthenticated 
                        ? "btn-secondary disabled" 
                        : bq.liked 
                          ? "btn-danger" 
                          : "btn-outline-danger"
                    }`}
                    onClick={() => bq.liked ? handleUnlike(bq.id) : handleLike(bq.id)}
                    disabled={!isAuthenticated}
                  >
                    {bq.liked ? "💔 Unlike" : "❤️ Like"}
                  </button>

                  {/* Nombre de likes cliquable */}
                  {isAuthenticated && (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => showLikers(bq.id)}
                    >
                      {bq.likesCount || 0} ❤️
                    </button>
                  )}
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={() => handleAddToCart(bq.id)}
                >
                  🛒 Acheter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour afficher les likers */}
      {showLikersModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Utilisateurs qui ont liké</h5>
                <button className="btn-close" onClick={() => setShowLikersModal(null)}></button>
              </div>
              <div className="modal-body">
                {showLikersModal.length === 0 ? (
                  <p>Aucun like pour le moment</p>
                ) : (
                  <ul className="list-group">
                    {showLikersModal.map((user, idx) => (
                      <li key={idx} className="list-group-item">
                        👤 {user.nomComplet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bouquets;