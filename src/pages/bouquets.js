import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBouquets, toggleLike } from "../store/bouquetsSlice";
import { myFetch } from "../comm/MyFetch";

function Bouquets() {
  const bouquets = useSelector((state) => state.bouquets.list);
  const dispatch = useDispatch();

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

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">Nos Bouquets 💐</h1>

      <div className="row">
        {bouquets.map((bq) => (
          <div key={bq.id} className="col-md-4 mb-4">
            <div
               className="card shadow-sm h-100"
               style={{ cursor: "pointer" }}
               onClick={() => (window.location.href = `/bouquets/${bq.id}`)}
            >
              <img
                src={bq.image}
                alt={bq.name}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title">{bq.name}</h5>
                <p className="card-text">{bq.description}</p>
                <p className="fw-bold text-primary">{bq.price} DA</p>

                <button
                  className={`btn ${bq.liked ? "btn-danger" : "btn-outline-danger"} w-100`}
                  onClick={() => dispatch(toggleLike(bq.id))}
                >
                  {bq.liked ? "💔 Unlike" : "❤️ Like"}
                </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bouquets;
