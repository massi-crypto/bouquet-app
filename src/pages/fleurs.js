import { useState, useEffect } from "react";
import { myFetch } from "../comm/MyFetch";

function Fleurs() {
  const [fleurs, setFleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFleurs = async () => {
      try {
        setLoading(true);
        const data = await myFetch("/fleurs");
        setFleurs(data);
        setError(null);
      } catch (err) {
        console.error("Erreur chargement fleurs:", err);
        setError("Impossible de charger les fleurs");
      } finally {
        setLoading(false);
      }
    };

    loadFleurs();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des fleurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erreur !</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Assurez-vous que le serveur backend est démarré sur le port 5000.
          </p>
        </div>
      </div>
    );
  }

  if (fleurs.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Aucune fleur disponible. Lancez le seed pour ajouter des données.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Nos Fleurs 🌷</h1>
      <div className="row">
        {fleurs.map((fleur) => (
          <div key={fleur.id} className="col-md-4 mb-4 d-flex">
            <div className="card shadow-sm h-100 flex-fill">
              <div 
                className="card-img-top bg-gradient"
                style={{ 
                  height: "200px",
                  background: `linear-gradient(135deg, 
                    ${getFlowerColor(fleur.name)} 0%, 
                    ${getFlowerColor(fleur.name)}99 100%)`
                }}
              >
                <div className="d-flex align-items-center justify-content-center h-100">
                  <span style={{ fontSize: "80px" }}>
                    {getFlowerEmoji(fleur.name)}
                  </span>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark fw-bold">{fleur.name}</h5>
                <p className="card-text text-muted flex-grow-1">
                  {fleur.description}
                </p>
                <div className="mt-3">
                  <span className="badge bg-success fs-6">
                    {fleur.unitPrice} DA / unité
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fonction helper pour obtenir la couleur selon le type de fleur
function getFlowerColor(name) {
  const colors = {
    'Rose': '#ff6b9d',
    'Tulipe': '#ffb347',
    'Jasmin': '#f0e68c',
    'Orchidée': '#dda0dd',
    'Marguerite': '#ffffff',
    'Lys': '#fffacd'
  };
  return colors[name] || '#98d8c8';
}

// Fonction helper pour obtenir l'emoji selon le type de fleur
function getFlowerEmoji(name) {
  const emojis = {
    'Rose': '🌹',
    'Tulipe': '🌷',
    'Jasmin': '🌼',
    'Orchidée': '🌺',
    'Marguerite': '🌸',
    'Lys': '🏵️'
  };
  return emojis[name] || '🌻';
}

export default Fleurs;