import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import NowHeader from "../components/now/NowHeader";
import { listAmazonCartItems } from "../services/sidekickChatService";
import type { AmazonCartItem } from "../services/sidekickChatService";
import "../styles/amazon-now.css";

export default function AmazonNowCartPage() {
  const [items, setItems] = useState<AmazonCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const subtotal = items.reduce((total, item) => total + Number(item.price ?? 0), 0);
  const itemCount = items.reduce((total, item) => total + Number(item.quantity ?? 0), 0);

  useEffect(() => {
    void loadCart();
  }, []);

  async function loadCart() {
    setIsLoading(true);

    try {
      setItems(await listAmazonCartItems());
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="now-page now-cart-page">
      <NowHeader />

      <section className="now-cart-shell">
        <div className="now-cart-heading">
          <Link to="/now" aria-label="Back to Amazon Now">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <span>Amazon Now Cart</span>
            <h1>{itemCount > 0 ? `${formatNumber(itemCount)} items ready` : "Your cart is empty"}</h1>
          </div>
          <strong>Rs.{formatPrice(subtotal)}</strong>
        </div>

        {isLoading ? (
          <div className="now-cart-empty">Loading cart...</div>
        ) : items.length > 0 ? (
          <div className="now-cart-layout">
            <div className="now-cart-items">
              {items.map((item) => (
                <article className="now-cart-item" key={item.id}>
                  <img
                    src={item.image_url ?? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=320&q=80"}
                    alt=""
                  />
                  <div>
                    <h2>{item.product_title}</h2>
                    <p>{item.brand}</p>
                    <small>
                      x {formatNumber(item.quantity)} | {item.pack_size}
                    </small>
                  </div>
                  <strong>Rs.{formatPrice(item.price)}</strong>
                </article>
              ))}
            </div>

            <aside className="now-cart-summary">
              <span>
                <ShoppingCart size={18} />
                Order summary
              </span>
              <div>
                <p>Items</p>
                <strong>{formatNumber(itemCount)}</strong>
              </div>
              <div>
                <p>Subtotal</p>
                <strong>Rs.{formatPrice(subtotal)}</strong>
              </div>
              <button type="button">Proceed to checkout</button>
            </aside>
          </div>
        ) : (
          <div className="now-cart-empty">
            <ShoppingCart size={34} />
            <p>Add a Sidekick Cart to Amazon Cart and it will appear here.</p>
            <Link to="/now">Continue shopping</Link>
          </div>
        )}
      </section>
    </main>
  );
}

function formatNumber(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function formatPrice(value: number) {
  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}
