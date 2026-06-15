import { Route, Routes } from "react-router-dom";
import AmazonHomePage from "./pages/AmazonHomePage";
import AmazonNowCartPage from "./pages/AmazonNowCartPage";
import AmazonNowPage from "./pages/AmazonNowPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AmazonHomePage />} />
      <Route path="/now" element={<AmazonNowPage />} />
      <Route path="/now/cart" element={<AmazonNowCartPage />} />
    </Routes>
  );
}
