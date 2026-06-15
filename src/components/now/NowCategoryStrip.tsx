import type { NowCategory } from "../../data/amazonNowData";

type NowCategoryStripProps = {
  categories: NowCategory[];
};

export default function NowCategoryStrip({ categories }: NowCategoryStripProps) {
  return (
    <section className="now-category-strip" aria-label="Amazon Now categories">
      {categories.map((category) => (
        <button key={category.name}>
          <img src={category.image} alt="" />
          <span>{category.name}</span>
        </button>
      ))}
    </section>
  );
}
