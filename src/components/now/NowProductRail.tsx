import type { NowProduct } from "../../data/amazonNowData";
import NowProductCard from "./NowProductCard";

type NowProductRailProps = {
  title: string;
  products: NowProduct[];
  tone?: "green" | "white";
};

export default function NowProductRail({ title, products, tone = "white" }: NowProductRailProps) {
  return (
    <section className={`now-product-rail rail-${tone}`}>
      <div className="rail-heading">
        <h2>{title}</h2>
        <button>See all</button>
      </div>
      <div className="now-product-grid">
        {products.map((product) => (
          <NowProductCard product={product} key={product.name} />
        ))}
      </div>
    </section>
  );
}
