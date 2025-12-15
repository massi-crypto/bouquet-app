import { useState, useEffect } from "react";
import { myFetch } from "../comm/MyFetch";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // info, likes, purchases
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nomComplet: '', password: '' });

  // Pour l'exemple, on utilise userId = 1 (Ahmed)
  // En production, on récupérerait l'ID depuis la session
  const userId = 1;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await myFetch(`/users/${userId}/profile`);
      setProfile(data);
      setFormData({ nomComplet: data.user.nomComplet, password: '' });
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await myFetch(`/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      alert('Profil mis à jour !');
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      alert('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Erreur de chargement du profil</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px', fontSize: '48px' }}
                >
                  {profile.user.nomComplet.charAt(0).toUpperCase()}
                </div>
              </div>
              <h5 className="card-title">{profile.user.nomComplet}</h5>
              <p className="text-muted small">{profile.user.login}</p>
              <span className="badge bg-info">{profile.user.role}</span>
            </div>
          </div>

          <div className="card shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-subtitle mb-3 text-muted">Statistiques</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>💰 Total dépensé:</span>
                <strong>{profile.stats.totalSpent} DA</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>🛍️ Achats:</span>
                <strong>{profile.stats.totalTransactions}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>❤️ Likes:</span>
                <strong>{profile.stats.totalLikes}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                📋 Informations
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'likes' ? 'active' : ''}`}
                onClick={() => setActiveTab('likes')}
              >
                ❤️ Mes Likes ({profile.stats.totalLikes})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'purchases' ? 'active' : ''}`}
                onClick={() => setActiveTab('purchases')}
              >
                🛍️ Mes Achats ({profile.stats.totalTransactions})
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          {activeTab === 'info' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>Informations personnelles</h5>
                  {!editing && (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditing(true)}
                    >
                      ✏️ Modifier
                    </button>
                  )}
                </div>

                {!editing ? (
                  <div>
                    <div className="mb-3">
                      <label className="text-muted">Email</label>
                      <p className="fw-bold">{profile.user.login}</p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Nom complet</label>
                      <p className="fw-bold">{profile.user.nomComplet}</p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Rôle</label>
                      <p><span className="badge bg-info">{profile.user.role}</span></p>
                    </div>
                    <div className="mb-3">
                      <label className="text-muted">Membre depuis</label>
                      <p className="fw-bold">
                        {new Date(profile.user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label className="form-label">Nom complet</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nomComplet}
                        onChange={(e) => setFormData({...formData, nomComplet: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nouveau mot de passe (optionnel)</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Laisser vide pour ne pas changer"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success">
                        💾 Enregistrer
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setEditing(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'likes' && (
            <div>
              {profile.user.LikedBouquets.length === 0 ? (
                <div className="alert alert-info">
                  Vous n'avez pas encore liké de bouquets
                </div>
              ) : (
                <div className="row">
                  {profile.user.LikedBouquets.map((bouquet) => (
                    <div key={bouquet.id} className="col-md-4 mb-4">
                      <div className="card shadow-sm h-100">
                        <img
                          src={bouquet.image}
                          alt={bouquet.name}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h6 className="card-title">{bouquet.name}</h6>
                          <p className="text-muted small">{bouquet.description}</p>
                          <p className="fw-bold text-primary">{bouquet.price} DA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              {profile.user.Transactions.length === 0 ? (
                <div className="alert alert-info">
                  Vous n'avez pas encore effectué d'achat
                </div>
              ) : (
                <div className="list-group">
                  {profile.user.Transactions.map((transaction) => (
                    <div key={transaction.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1">
                            Commande #{transaction.id}
                          </h6>
                          <small className="text-muted">
                            {new Date(transaction.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success fs-5">
                            {transaction.total} DA
                          </div>
                          <span className={`badge bg-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <strong>Articles :</strong>
                        <ul className="list-unstyled mt-2">
                          {transaction.Bouquets.map((bouquet) => (
                            <li key={bouquet.id} className="mb-1">
                              <span className="badge bg-secondary me-2">
                                x{bouquet.TransactionItem.quantity}
                              </span>
                              {bouquet.name}
                              <span className="text-muted ms-2">
                                ({bouquet.TransactionItem.price} DA)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;