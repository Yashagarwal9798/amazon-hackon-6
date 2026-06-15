import { Link } from "react-router-dom";
import { ChevronDown, MapPin, Menu, Search, ShoppingCart } from "lucide-react";
import { navItems } from "../../data/amazonHomeData";

export default function AmazonHeader() {
  return (
    <header className="amazon-header">
      <div className="amazon-header-main">
        <Link className="amazon-logo" to="/" aria-label="Amazon home">
          <span>amazon</span>
          <small>.in</small>
          <strong>prime</strong>
        </Link>

        <div className="deliver-block">
          <MapPin size={21} />
          <div>
            <span>Deliver to Yash</span>
            <strong>Navi Mumbai 400703</strong>
          </div>
        </div>

        <form className="amazon-search">
          <button type="button" className="search-select">
            All <ChevronDown size={16} />
          </button>
          <input aria-label="Search Amazon.in" placeholder="Search Amazon.in" />
          <button type="submit" className="search-submit" aria-label="Search">
            <Search size={29} />
          </button>
        </form>

        <div className="language-switch">IN&nbsp; EN</div>

        <div className="account-link">
          <span>Hello, Ajay</span>
          <strong>
            Account & Lists <ChevronDown size={14} />
          </strong>
        </div>

        <div className="orders-link">
          <span>Returns</span>
          <strong>& Orders</strong>
        </div>

        <div className="cart-link">
          <span>5</span>
          <ShoppingCart size={36} />
          <strong>Cart</strong>
        </div>
      </div>

      <nav className="amazon-subnav" aria-label="Amazon sections">
        <button className="subnav-all">
          <Menu size={27} /> All
        </button>
        <Link to="/now" className="now-nav-pill">
          <span>7</span>
          <strong>min Now</strong>
        </Link>
        {navItems.slice(1).map((item) => (
          <a href="#" key={item}>
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
