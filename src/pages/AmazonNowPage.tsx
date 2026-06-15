import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Menu, ShoppingCart, User, WalletCards, X } from "lucide-react";
import NowCategoryStrip from "../components/now/NowCategoryStrip";
import NowHeader from "../components/now/NowHeader";
import NowProductRail from "../components/now/NowProductRail";
import SidekickLauncher from "../components/sidekick/SidekickLauncher";
import SidekickWorkspace from "../components/sidekick/SidekickWorkspace";
import {
  farmLootProducts,
  nowCategories,
  recommendedProducts,
} from "../data/amazonNowData";
import { listAmazonCartItems } from "../services/sidekickChatService";
import "../styles/amazon-now.css";
import "../styles/sidekick.css";

export default function AmazonNowPage() {
  const [isSidekickOpen, setIsSidekickOpen] = useState(false);
  const [showSidekickIntro, setShowSidekickIntro] = useState(true);
  const [amazonCartSummary, setAmazonCartSummary] = useState({ count: 0, subtotal: 0 });

  useEffect(() => {
    void refreshAmazonCartSummary();
  }, []);

  async function refreshAmazonCartSummary() {
    const items = await listAmazonCartItems();
    setAmazonCartSummary({
      count: items.reduce((total, item) => total + Number(item.quantity ?? 0), 0),
      subtotal: items.reduce((total, item) => total + Number(item.price ?? 0), 0),
    });
  }

  function openSidekick() {
    setShowSidekickIntro(false);
    setIsSidekickOpen(true);
  }

  return (
    <main className="now-page">
      <NowHeader />
      <NowCategoryStrip categories={nowCategories} />

      <section className="now-banner back-school-banner">
        <div>
          <span>Back to school</span>
          <h1>Up to 80% off</h1>
          <p>Notebooks, lunch boxes, snacks, and quick top-ups.</p>
        </div>
      </section>

      <section className="now-benefits">
        <article>Assured cashback every time</article>
        <article>Rs.50 above Rs.399</article>
        <article>Rs.100 above Rs.749</article>
        <article>Free delivery above Rs.149</article>
      </section>

      <section className="now-shortcut">
        <div className="now-app-icon">now</div>
        <div>
          <h2>Shop faster with Amazon Now</h2>
          <p>Add shortcut to your homescreen</p>
        </div>
        <button aria-label="Shortcut toggle"></button>
      </section>

      <NowProductRail title="Deals under Rs.8 - Farm Loot" products={farmLootProducts} tone="green" />

      <section className="now-recommend-tabs">
        {["Top Picks", "Chips & Munchies", "Chocolates & Ice-cream", "All vegetables", "Ready to Eat & Cook"].map(
          (tab, index) => (
            <button className={index === 0 ? "active" : ""} key={tab}>
              {tab}
            </button>
          ),
        )}
      </section>

      <NowProductRail title="Recommended for you" products={recommendedProducts} />

      <section className="now-desktop-deals">
        <article className="deal-blue">
          <h2>Deals delivered by tomorrow</h2>
          <p>Stationery, home refresh, and saved-item picks.</p>
        </article>
        <article className="deal-teal">
          <h2>Starter refills</h2>
          <p>Trusted everyday products from nearby stores.</p>
        </article>
        <article className="deal-pink">
          <h2>Get your home delivered</h2>
          <p>Quick top-ups for food, cleaning, and personal care.</p>
        </article>
      </section>

      <aside className="now-cart-progress">
        <div>
          <ShoppingCart size={26} />
        </div>
        {amazonCartSummary.count > 0 ? (
          <p>
            <strong>{formatCartCount(amazonCartSummary.count)} items</strong>
            <span>Rs.{formatPrice(amazonCartSummary.subtotal)} in Amazon Cart</span>
          </p>
        ) : (
          <p>
            Add items worth <strong>Rs.149</strong>
            <span>to get free delivery</span>
          </p>
        )}
        <Link to="/now/cart">View cart</Link>
      </aside>

      {showSidekickIntro && !isSidekickOpen ? (
        <aside className="sidekick-popup-overlay" role="dialog" aria-modal="true" aria-label="Try Amazon Sidekick">
          <div className="sidekick-popup-card">
            <button
              className="sidekick-popup-close"
              type="button"
              aria-label="Close Sidekick invite"
              onClick={() => setShowSidekickIntro(false)}
            >
              <X size={22} />
            </button>
            <button className="sidekick-popup-image-button" type="button" onClick={openSidekick}>
              <img src="/sidekick/popup.png" alt="Try Amazon Sidekick smart shopping assistant" />
            </button>
          </div>
        </aside>
      ) : null}

      <SidekickLauncher onOpen={openSidekick} />
      {isSidekickOpen ? (
        <SidekickWorkspace
          onClose={() => setIsSidekickOpen(false)}
          onAmazonCartUpdated={() => void refreshAmazonCartSummary()}
        />
      ) : null}

      <nav className="now-bottom-nav" aria-label="Amazon Now shortcuts">
        <Link to="/">
          <Home size={24} /> Home
        </Link>
        <a href="#">
          <User size={24} /> You
        </a>
        <a href="#">
          <WalletCards size={24} /> Wallet
        </a>
        <Link to="/now/cart">
          <ShoppingCart size={24} /> Cart
        </Link>
        <a href="#">
          <Menu size={24} /> Browse
        </a>
      </nav>
    </main>
  );
}

function formatCartCount(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function formatPrice(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}
