import { useState, useEffect } from "react";
import { myFetch } from "../comm/MyFetch";

function Backoffice() {
  const [bouquet, setBouquet] = useState({
    name: "",
    description: "",
    image: "",
    price: ""
  });
  
  const [flowers, setFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentBouquet, setCurrentBouquet] = useState(null);
  const [message, setMessage] = useState("");

  // Charger les fleurs disponibles
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await myFetch("/fleurs");
        setFlowers(data);
      } catch (error) {
        console.error("Erreur chargement fleurs:", error);
        setMessage("❌ Erreur lors du chargement des fleurs");
      }
    };
    
    loadData();
    loadCurrentBouquet();
  }, []);

  const loadCurrentBouquet = async () => {
    try {
      const data = await myFetch("/backoffice/bouquet/current");
      setCurrentBouquet(data);
      setMessage("Bouquet en cours récupéré !");
    } catch (error) {
      console.log("Aucun bouquet en cours");
      setCurrentBouquet(null);
    }
  };

  const handleStartBouquet = async (e) => {
    e.preventDefault();
    try {
      const data = await myFetch("/backoffice/bouquet/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bouquet)
      });
      
      setCurrentBouquet(data.bouquet);
      setMessage("Bouquet initialisé ! Ajoutez maintenant des fleurs.");
    } catch (error) {
      setMessage("Erreur lors de l'initialisation");
    }
  };

  const handleAddFlower = async () => {
    if (!selectedFlower) return;
    
    try {
      const data = await myFetch("/backoffice/bouquet/add-flower", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowerId: selectedFlower,
          quantity: quantity
        })
      });
      
      setCurrentBouquet(data.bouquet);
      setMessage("Fleur ajoutée !");
      setSelectedFlower("");
      setQuantity(1);
    } catch (error) {
      setMessage("Erreur lors de l'ajout");
    }
  };

  const handleRemoveFlower = async (flowerId) => {
    try {
      const data = await myFetch("/backoffice/bouquet/remove-flower", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowerId })
      });
      
      setCurrentBouquet(data.bouquet);
      setMessage("Fleur retirée");
    } catch (error) {
      setMessage("Erreur lors du retrait");
    }
  };

  const handleFinalize = async () => {
    try {
      await myFetch("/backoffice/bouquet/finalize", {
        method: "POST"
      });
      
      setCurrentBouquet(null);
      setBouquet({ name: "", description: "", image: "", price: "" });
      setMessage("✅ Bouquet créé avec succès !");
    } catch (error) {
      setMessage("Erreur lors de la finalisation");
    }
  };

  const handleCancel = async () => {
    try {
      await myFetch("/backoffice/bouquet/cancel", {
        method: "DELETE"
      });
      
      setCurrentBouquet(null);
      setMessage("Bouquet annulé");
    } catch (error) {
      setMessage("Erreur");
    }
  };

  const getFlowerName = (flowerId) => {
    const flower = flowers.find(f => f.id === flowerId);
    return flower ? flower.name : "Fleur inconnue";
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">🌸 Backoffice - Création de Bouquet</h1>
      
      {message && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
        </div>
      )}

      {!currentBouquet ? (
        <div className="card p-4 shadow">
          <h3>Étape 1 : Informations du bouquet</h3>
          <form onSubmit={handleStartBouquet}>
            <div className="mb-3">
              <label className="form-label">Nom du bouquet</label>
              <input
                type="text"
                className="form-control"
                value={bouquet.name}
                onChange={(e) => setBouquet({...bouquet, name: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={bouquet.description}
                onChange={(e) => setBouquet({...bouquet, description: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">URL de l'image</label>
              <input
                type="text"
                className="form-control"
                value={bouquet.image}
                onChange={(e) => setBouquet({...bouquet, image: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prix (DA)</label>
              <input
                type="number"
                className="form-control"
                value={bouquet.price}
                onChange={(e) => setBouquet({...bouquet, price: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Commencer le bouquet
            </button>
          </form>
        </div>
      ) : (
        <div>
          <div className="card p-4 shadow mb-4">
            <h3>Bouquet en cours : {currentBouquet.name}</h3>
            <p>{currentBouquet.description}</p>
            <p className="fw-bold">Prix : {currentBouquet.price} DA</p>

            <h4 className="mt-4">Composition actuelle :</h4>
            {currentBouquet.flowers.length === 0 ? (
              <p className="text-muted">Aucune fleur ajoutée</p>
            ) : (
              <ul className="list-group">
                {currentBouquet.flowers.map((f, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{getFlowerName(f.flowerId)} x {f.quantity}</span>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveFlower(f.flowerId)}
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-4 shadow mb-4">
            <h4>Ajouter une fleur</h4>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Fleur</label>
                <select
                  className="form-select"
                  value={selectedFlower}
                  onChange={(e) => setSelectedFlower(e.target.value)}
                >
                  <option value="">-- Choisir une fleur --</option>
                  {flowers.map(flower => (
                    <option key={flower.id} value={flower.id}>
                      {flower.name} ({flower.unitPrice} DA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Quantité</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="col-md-2 d-flex align-items-end mb-3">
                <button 
                  className="btn btn-success w-100"
                  onClick={handleAddFlower}
                  disabled={!selectedFlower}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button 
              className="btn btn-primary flex-fill"
              onClick={handleFinalize}
              disabled={currentBouquet.flowers.length === 0}
            >
              ✅ Finaliser le bouquet
            </button>
            <button 
              className="btn btn-danger flex-fill"
              onClick={handleCancel}
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Backoffice;