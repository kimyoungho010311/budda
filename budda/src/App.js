import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./router/MainPage";
import RecipePage from "./router/RecipePage";
import LoginPage from "./router/LoginPage";
import NotFound from "./router/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/budda" element={<MainPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/login/signup" element={<SignUpPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
