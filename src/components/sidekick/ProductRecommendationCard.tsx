export type SidekickProduct = {
  item: string;
  name: string;
  price: number;
  reason: string;
  image: string;
};

type ProductRecommendationCardProps = {
  product: SidekickProduct;
  onChange: (item: string) => void;
};

export default function ProductRecommendationCard({
  product,
  onChange,
}: ProductRecommendationCardProps) {
  return (
    <article className="sidekick-product-card">
      <div className="sidekick-product-label">{product.item}</div>
      <div className="sidekick-product-image" aria-label={`Product image for ${product.name}`}>
        <img src={product.image} alt={product.name} />
      </div>
      <div>
        <h4>{product.name}</h4>
        <strong>Rs.{product.price}</strong>
        <p>{product.reason}</p>
      </div>
      <button type="button" onClick={() => onChange(product.item)}>
        Change
      </button>
    </article>
  );
}
