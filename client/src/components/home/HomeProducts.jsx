import Lottie from "lottie-react";
import Containar from "../containar/Containar";
import service from "../../assets/animation/product.json";

import ProductSlider from "../../sliders/ProductSlider/ProductSlider";
const HomeProducts = () => {
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   fetch("puducts.json")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setProducts(data);
  //     });
  // }, []);
  return (
    <Containar>
      <div className="mt-14">
        {/* <div className="flex justify-center">
          <Lottie animationData={service} className="w-[50px] h-[50px]" />
        </div> */}
        <div className="text-center mt-4">
          <h5 className="lg:text-2xl md:text-xl text-lg  font-bold  uppercase text-primary">
            Our Latest Products
          </h5>
          <h2 className="text-lg md:px-10 px-2 mx-auto mt-1">
            Genuine Spare Parts for ACs, Fridges, and More!
          </h2>
        </div>

        <div>
          <ProductSlider></ProductSlider>
        </div>
      </div>
    </Containar>
  );
};

export default HomeProducts;
