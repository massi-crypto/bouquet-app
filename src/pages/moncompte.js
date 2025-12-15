import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MonCompte() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    nomComplet: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login({ login: formData.login, password: formData.password });
      } else {
        result = await register(formData);
      }

      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setFormData({ login: "", password: "", nomComplet: "" });
  };

  // Si déjà connecté
  if (user) {
    return (
      <div className="container mt-5" style={{ maxWidth: "600px" }}>
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <div 
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px', fontSize: '36px' }}
            >
              {user.nomComplet.charAt(0).toUpperCase()}
            </div>
            <h4 className="card-title">Bienvenue, {user.nomComplet} !</h4>
            <p className="text-muted">{user.login}</p>
            <span className="badge bg-info mb-3">{user.role}</span>
            
            <div className="d-grid gap-2 mt-4">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/profile')}
              >
                📋 Voir mon profil complet
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/bouquets')}
              >
                🛍️ Continuer mes achats
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sinon, afficher le formulaire de connexion/inscription
  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="text-center text-primary mb-4">
            {isLogin ? "Connexion 🔐" : "Inscription 📝"}
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Nom complet</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nomComplet}
                  onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
                  required={!isLogin}
                  placeholder="Ex: Ahmed Ben Ali"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Adresse Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.login}
                onChange={(e) => setFormData({...formData, login: e.target.value})}
                required
                placeholder="exemple@email.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="••••••••"
                minLength={6}
              />
              {!isLogin && (
                <small className="text-muted">Minimum 6 caractères</small>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              {isLogin ? "Se connecter" : "S'inscrire"}
            </button>
          </form>

          <div className="text-center">
            <button 
              className="btn btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonCompte;