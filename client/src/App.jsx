import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CosmicLoader from "./components/Loader/CosmicLoader";
import Layout from "./components/layout/Layout";
import AboutPage from "./pages/AboutPage";
import AdminDashboard from "./pages/AdminDashboard";
import ActivitiesPage from "./pages/ActivitiesPage";
import ActivityDetailPage from "./pages/activities/ActivityDetailPage";
import ContactPage from "./pages/ContactPage";
import DonationsPage from "./pages/DonationsPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import TemplePage from "./pages/TemplePage";

function MainApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="temple" element={<TemplePage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="activities/:slug" element={<ActivityDetailPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <CosmicLoader onFinish={() => setLoading(false)} />;
  }

  return <MainApp />;
}

export default App;
