import { useState } from "react";
import ProductContext from "./productContext";

const ProductState = (props) => {
  const s1 = {
    name: "Codeswear",
    site: "ecommerce",
  };
  const [state, setState] = useState(s1);
  const update = () => {
    setTimeout(() => {
      setState({
        name: "Netflix",
        site: "OTT",
      });
    }, 1000);
  };
  return (
    <ProductContext.Provider value={{ state, update }}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;
