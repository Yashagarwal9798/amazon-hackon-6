import type { HomeSection } from "../../data/amazonHomeData";

type HomeProductSectionProps = {
  section: HomeSection;
};

export default function HomeProductSection({ section }: HomeProductSectionProps) {
  return (
    <section className="home-section">
      <h2>{section.title}</h2>
      <div className="home-product-grid">
        {section.products.map((product) => (
          <article key={product.name} className="home-product">
            <img src={product.image} alt={product.name} />
            {product.label ? <span>{product.label}</span> : null}
            <p>{product.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
