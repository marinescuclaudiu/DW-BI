import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cafenea from "./pages/Cafenea";
import Rapoarte from "./pages/Rapoarte";
const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="cafenea/:id_cafenea" element={<Cafenea />} />
      <Route path="/rapoarte" element={<Rapoarte />} />
    </Routes>
  );
};

export default App;
