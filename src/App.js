import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Features from "./pages/Features";
import Classifier from "./pages/Classifier";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/classifier"
          element={<Classifier />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;