import { Link } from "react-router-dom";
import { Camera, MapPin, Mic, QrCode, X } from "lucide-react";
import SearchBar from "../common/SearchBar";

export default function NowHeader() {
  return (
    <header className="now-header">
      <div className="now-header-top">
        <Link to="/" className="now-user-chip" aria-label="Back to Amazon">
          amazon
        </Link>
        <Link to="/now" className="now-logo">
          amazon<span>now</span>
        </Link>
        <Link to="/" className="now-close" aria-label="Close Amazon Now">
          <X size={25} />
        </Link>
      </div>

      <div className="now-delivery-row">
        <div className="now-time-badge">7 mins</div>
        <button>
          <MapPin size={19} />
          Deliver to 60, Sector 19F Vashi Road, Navi Mumbai
        </button>
      </div>

      <div className="now-search-row">
        <SearchBar placeholder='Search for "Coffee"' compact />
        <button aria-label="Search by camera">
          <Camera size={24} />
        </button>
        <button aria-label="Voice search">
          <Mic size={24} />
        </button>
        <button aria-label="Scan code">
          <QrCode size={24} />
        </button>
      </div>
    </header>
  );
}
