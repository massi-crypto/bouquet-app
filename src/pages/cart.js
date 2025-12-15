import { useState, useEffect } from "react";
import { myFetch } from "../comm/MyFetch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await myFetch("/cart");
      setCart(data);
    } catch (error) {
      console.error("Erreur chargement panier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bouquetId) => {
    try {
      await myFetch("/cart/remove", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bouquetId })
      });
      
      loadCart();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

const handleCheckout = async () => {
  if (!isAuthenticated) {
    alert('Veuillez vous connecter pour finaliser l\'achat');
    navigate('/moncompte');
    return;
  }

  try {
    await myFetch("/cart/checkout", {  // ← Retirer 'const response ='
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    });

    alert('✅ Achat effectué avec succès !');
    navigate('/profile');
  } catch (error) {
    console.error("Erreur checkout:", error);
    alert('❌ Erreur lors de l\'achat');
  }
};

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">🛒 Mon Panier</h1>

      {cart.items.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>Votre panier est vide</h4>
          <p>Ajoutez des bouquets pour commencer vos achats</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/bouquets')}
          >
            Voir les bouquets
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Articles ({cart.items.length})</h5>
                
                {cart.items.map((item) => (
                  <div key={item.bouquetId} className="row mb-3 pb-3 border-bottom">
                    <div className="col-md-3">
                      <img
                        src={item.bouquet.image}
                        alt={item.bouquet.name}
                        className="img-fluid rounded"
                        style={{ height: "100px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h6>{item.bouquet.name}</h6>
                      <p className="text-muted small">{item.bouquet.description}</p>
                      <p className="text-primary fw-bold">
                        {item.bouquet.price} DA x {item.quantity}
                      </p>
                    </div>
                    <div className="col-md-3 text-end">
                      <div className="fw-bold fs-5 mb-2">
                        {item.subtotal} DA
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.bouquetId)}
                      >
                        🗑️ Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Résumé</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total:</span>
                  <span>{cart.total} DA</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Livraison:</span>
                  <span className="text-success">Gratuite</span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <strong className="fs-5">Total:</strong>
                  <strong className="fs-5 text-primary">{cart.total} DA</strong>
                </div>

                <button 
                  className="btn btn-success w-100 mb-2"
                  onClick={handleCheckout}
                >
                  ✅ Valider la commande
                </button>
                
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate('/bouquets')}
                >
                  ← Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;