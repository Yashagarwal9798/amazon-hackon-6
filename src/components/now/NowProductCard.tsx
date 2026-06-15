import type { NowProduct } from "../../data/amazonNowData";

type NowProductCardProps = {
  product: NowProduct;
};

export default function NowProductCard({ product }: NowProductCardProps) {
  return (
    <article className="now-product-card">
      <span className="discount-badge">{product.discount}</span>
      <img src={product.image} alt={product.name} />
      {product.tag ? <small>{product.tag}</small> : null}
      <h3>{product.name}</h3>
      <p>{product.size}</p>
      <div className="price-row">
        <strong>Rs.{product.price}</strong>
        {product.mrp !== product.price ? <span>Rs.{product.mrp}</span> : null}
      </div>
      <button>Add</button>
    </article>
  );
}
