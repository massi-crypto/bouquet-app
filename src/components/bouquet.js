import { useState } from "react";

function Bouquet({ bouquet }) {
  const [liked, setLiked] = useState(bouquet.liked);

  const handleLike = async () => {
  const newLiked = !liked;
  setLiked(newLiked);

  await fetch(`http://localhost:5000/like?id=${bouquet.id}`, { method: "POST" });
};


  return (
    <div className="col-md-4 mb-4 d-flex">
      <div className="card shadow-sm h-100 flex-fill">
        <img
          src={bouquet.image}
          alt={bouquet.nom}
          className="card-img-top"
          style={{ height: "250px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">{bouquet.name}</h5>
          <p className="card-text">{bouquet.description}</p>
          <p className="fw-bold text-primary">{bouquet.price} DA</p>

          <button
            onClick={handleLike}
            className={`btn ${liked ? "btn-danger" : "btn-outline-danger"} w-100`}
          >
            {liked ? "💔 Unlike" : "❤️ Like"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bouquet;
