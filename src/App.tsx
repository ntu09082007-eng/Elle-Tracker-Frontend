import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RealtimePage from "./pages/RealtimePage";
import StatsPage from "./pages/StatsPage";
import PredictionPage from "./pages/PredictionPage";
import AboutPage from "./pages/AboutPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmptyPage from "./pages/EmptyPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-grow w-full mb-[20px] min-h-[calc(100vh-80px)]">
          <div className="w-full px-4 md:px-6 py-8">
            <Routes>
              <Route index element={<Navigate to="realtime" replace />} />
              <Route path="/realtime" element={<RealtimePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<EmptyPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
