import { IoCart } from "react-icons/io5";
import { useEffect, useState } from "react";

import { addToAgroCart } from "../../redux/slices/cart/agroCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { FiPlus } from "react-icons/fi";
import { Tooltip } from "antd";
import api from "../../components/axios/Axios";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleAddtoCart = (product) => {
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
  };

  const handleBuyNow = (product) => {
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
    navigate("/checkout");
  };

  const getProducts = async () => {
    try {
      const response = await api.get(`/home-appliance-product`);
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
    <div className="mt-8">
      <div className="">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-4">
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
                  <Link to={`/product/${product?.slug}`}>
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
                      to={`/product/${product?.slug}`}
                      className="font-medium text-lg capitalize"
                    >
                      {product?.title}
                    </Link>
                    <p className="text-gray-600 ">
                      {product?.discountValue > 0 ? (
                        <div className="flex items-center gap-2">
                          <p className="flex items-center gap-[2px] text-sm font-semibold">
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
                    <div className="flex items-center gap-2 mt-2 ">
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

      <div className="flex justify-center mt-4">
        <Link to="/products">
          <button className="bg-[#178843] hover:bg-[#24C462] duration-300 cursor-pointer rounded text-[#fff] md:px-6 px-4 py-3 font-medium flex items-center gap-2 justify-center md:mt-8 mt-6">
            <span className="text-base tracking-wider">View Products</span>
            <span className="md:text-base text-sm tracking-wider">
              <FiPlus />
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductSlider;
