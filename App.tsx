import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Production from "./pages/Production";
import Machines from "./pages/Machines";
import Workers from "./pages/Workers";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Maintenance from "./pages/Maintenance";
import QualityControl from "./pages/QualityControl";
import Analytics from "./pages/Analytics";
import Sustainability from "./pages/Sustainability";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="assistant" element={<AIAssistant />} />
          <Route path="production" element={<Production />} />
          <Route path="machines" element={<Machines />} />
          <Route path="workers" element={<Workers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="quality" element={<QualityControl />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sustainability" element={<Sustainability />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
