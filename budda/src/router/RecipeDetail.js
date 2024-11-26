import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import HowToUse from "../components/HowToUse/HowToUse";
function RecipeDetail() {
  const { id } = useParams();

  return (
    <div>
      <Navbar />
      <h1>Recipe Detail Page</h1>
      <p>Recipe ID: {id}</p>
      <HowToUse />
      <Footer />
    </div>
  );
}

export default RecipeDetail;
