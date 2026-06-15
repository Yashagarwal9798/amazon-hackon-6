import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Truck } from "lucide-react";
import HomeProductSection from "../components/amazon/HomeProductSection";
import AmazonHeader from "../components/layout/AmazonHeader";
import { dealRows, homeSections } from "../data/amazonHomeData";
import "../styles/amazon-home.css";

export default function AmazonHomePage() {
  return (
    <main className="amazon-page">
      <AmazonHeader />

      <section className="home-hero">
        <div className="hero-copy">
          <span>Smartchoice Days</span>
          <h1>Up to 60% off</h1>
          <p>Expert recommended tech, daily essentials, and repeat buys.</p>
          <Link to="/now" className="hero-now-link">
            Shop Amazon Now <ArrowRight size={20} />
          </Link>
        </div>
        <div className="hero-product-stage" aria-hidden="true">
          <div className="device laptop"></div>
          <div className="device tablet"></div>
          <div className="device watch"></div>
          <div className="device earbuds"></div>
        </div>
      </section>

      <section className="now-entry-panel">
        <div>
          <span className="now-entry-logo">7 min Now</span>
          <h2>Groceries, snacks, and essentials delivered fast</h2>
          <p>Open the Amazon Now demo page built from your mobile references.</p>
        </div>
        <div className="now-entry-points">
          <span>
            <Clock size={20} /> Fast delivery
          </span>
          <span>
            <Truck size={20} /> Daily essentials
          </span>
          <span>
            <ShieldCheck size={20} /> Amazon checkout
          </span>
        </div>
        <Link to="/now">Open Amazon Now</Link>
      </section>

      <section className="home-card-grid">
        {homeSections.map((section) => (
          <HomeProductSection section={section} key={section.title} />
        ))}
      </section>

      <section className="wide-deal-area">
        {dealRows.map((row) => (
          <article key={row.title}>
            <div>
              <span>{row.subtitle}</span>
              <h2>{row.title}</h2>
            </div>
            <ul>
              {row.products.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
