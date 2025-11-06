import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./layout/Layout";


export default function Router() {
  return (
    
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
   
  );
}
