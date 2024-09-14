import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Allroutes from "./Allroutes";
import ProductState from "./context/product/productState";



function App() {
  return (
    <div className="App">
      <ProductState>
        <Navbar />
        <Allroutes />
      </ProductState>
    </div>
  );
}

export default App;
