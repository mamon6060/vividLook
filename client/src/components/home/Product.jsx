import icon from "../../assets/home/product_icon.png";
import Containar from "../containar/Containar";
import { IoCart } from "react-icons/io5";
import { useEffect, useState } from "react";

import api from "../axios/Axios";
import { addToAgroCart } from "../../redux/slices/cart/agroCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import service from "../../assets/animation/product.json";
import { FiPlus } from "react-icons/fi";
import { Tooltip } from "antd";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleAddtoCart = (product) => {
    dispatch(
      addToAgroCart({
        ...product,
        quantity: 1,
        productType: "HomeApplianceProduct",
      })
    );
  };

  const handleBuyNow = (product) => {
    dispatch(
      addToAgroCart({
        ...product,
        quantity: 1,
        productType: "HomeApplianceProduct",
      })
    );
    navigate("/checkout");
  };

  const getProducts = async () => {
    try {
      const response = await api.get(`/products?limit=12`);
      setProducts(response.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="md:py-8  sm:py-[0px] font-robo relative  mt-8">
      <Containar>
        <div className="py-2 ">
          {/* <div className="flex justify-center">
            <Lottie animationData={service} className="w-[50px] h-[50px]" />
          </div> */}
          <div className="text-center mt-4">
            <h5 className="lg:text-2xl md:text-xl text-lg  font-bold  uppercase text-primary">
              Our Spare Parts
            </h5>
            <h2 className="text-lg md:px-10 px-2 mx-auto mt-1">
              Genuine Spare Parts for ACs, Fridges, and More!
            </h2>
          </div>
          <div className="md:mt-8 mt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-6 gap-2">
                {[...Array(12)].map((_, index) => (
                  <Skeleton key={index} height={300} />
                ))}
              </div>
            ) : products?.doc?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products?.doc?.slice(0, 10).map((product) => (
                  <>
                    <div
                      key={product._id}
                      className="rounded-lg overflow-hidden bg-white border group"
                    >
                      <Link to={`/shop/${product?.slug}`}>
                        <div className="overflow-hidden h-64">
                          <img
                            src={product?.photos[0]}
                            alt={product?.title || "Product Image"}
                            className="w-full h-full object-cover group-hover:scale-105 duration-300"
                          />
                        </div>
                      </Link>
                      <div className="px-4 py-4">
                        <Link
                          to={`/shop/${product?.slug}`}
                          className="font-medium text-base capitalize"
                        >
                          {product?.title}
                        </Link>
                        <p className="text-gray-600 ">
                          {product?.discountValue > 0 ? (
                            <div className="flex items-center gap-2">
                              <p className="flex items-center gap-[2px] text-xl font-semibold">
                                <span>৳</span>
                                <span>{product?.salePrice}</span>
                              </p>
                              <span className="line-through text-red-500">
                                ৳{product?.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-semibold">
                              ৳ {product?.salePrice}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-4 ">
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="rounded text-white bg-[#178843] hover:bg-[#24C462] transition-all px-4 py-1 text-base w-full tracking-wider"
                          >
                            Buy Now
                          </button>
                          <Tooltip
                            placement="top"
                            title="add to cart"
                            color="#178843"
                          >
                            <button
                              onClick={() => handleAddtoCart(product)}
                              className="bg-[#178843] hover:bg-[#24C462] transition-all text-white rounded px-2 py-1"
                            >
                              <IoCart className="inline w-5 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            ) : (
              <p className="h-32 flex items-center justify-center text-2xl font-semibold text-primary">
                No Products Available!
              </p>
            )}
          </div>
          <div className="flex justify-center">
            <Link to="/shop">
              <button className="bg-[#178843] hover:bg-[#24C462] duration-300 cursor-pointer rounded text-[#fff] md:px-6 px-4 py-3 font-medium flex items-center gap-2 justify-center md:mt-8 mt-6">
                <span className="md:text-base text-sm tracking-wider">
                  View Spare Parts
                </span>
                <span className="text-sm">
                  <FiPlus />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default Product;
