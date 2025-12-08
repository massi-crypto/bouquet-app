import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { myFetch } from "../comm/MyFetch";

function BouquetDetails() {
  const { id } = useParams();
  const [bouquet, setBouquet] = useState(null);

  useEffect(() => {
    myFetch(`/bouquets/${id}`).then((data) => {
      setBouquet(data);
    });
  }, [id]);

  if (!bouquet) return <h2 className="text-center mt-5">Chargement...</h2>;

  // ➤ Calcul du prix total
  const total = bouquet.Flowers.reduce((sum, f) => {
    return sum + f.unitPrice * f.BouquetFlower.quantity;
  }, 0);

  return (
    <div className="container mt-5">

      <h1 className="text-center text-primary mb-4">
        {bouquet.name}
      </h1>

      <div className="card p-3 shadow">
        <img
          src={bouquet.image}
          alt={bouquet.name}
          className="card-img-top"
          style={{ height: "350px", objectFit: "cover" }}
        />

        <div className="card-body">
          <p className="fw-bold">{bouquet.description}</p>
          <h4>Prix affiché : {bouquet.price} DA</h4>

          <h3 className="mt-4">Composition 🌸</h3>
          <ul className="list-group">
            {bouquet.Flowers.map((flower) => (
              <li key={flower.id} className="list-group-item d-flex justify-content-between">
                <span>{flower.name} (x{flower.BouquetFlower.quantity})</span>
                <span>{flower.unitPrice} DA / fleur</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-4 text-success">
            Prix total réel : {total} DA
          </h3>
        </div>

      </div>
    </div>
  );
}

export default BouquetDetails;
