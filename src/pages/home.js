function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-5 fw-bold text-primary mb-3">Bienvenue sur Bouquets Express 🌸</h1>
        <p className="lead">
          Livraison rapide de magnifiques bouquets de fleurs partout en Algérie.
        </p>
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
          alt="Bouquets"
          className="img-fluid rounded shadow mt-4"
        />
      </div>
    </div>
  );
}

export default Home;
