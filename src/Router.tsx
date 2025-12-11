import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./layout/Layout";
import EventsDashboard from "./pages/EventsDashboard";
import EventEntry from "./pages/EventEntry";
import SingleEventPage from "./pages/SingleEventPage";
import LoginSignupPage from "./pages/LoginSignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfilePage from "./pages/UserProfilePage";


export default function Router() {
  return (

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="/events" element={<EventsDashboard />} />
          <Route path="/event-entry" element={<EventEntry />} />
          <Route path="/events/:id" element={<SingleEventPage />} />
           <Route path="/profile" element={<UserProfilePage />} />
        </Route>
        <Route path="/auth" element={<LoginSignupPage />} />
      </Route>
    </Routes>

  );
}
