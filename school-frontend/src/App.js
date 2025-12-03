import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EventsPage from "./pages/EventsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="*" element={<div className="p-8 text-center">404 — Page not found</div>} />
      </Routes>
    </Router>
  );
}
