import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleServiceBradCumbs from "../components/shared/SingleServiceBradCumbs";
import Containar from "../components/containar/Containar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
} from "react-icons/fa6";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../components/axios/Axios";
import BestSellProduct from "../components/shop/BestSellProduct";
import RelatedProductItem from "../components/shop/RelatedProductItem";
import Skeleton from "react-loading-skeleton";
import {
  addToServiceCart,
  updateQuantity,
  decreaseQuantity,
  deleteFromServiceCart,
} from "../redux/slices/cart/serviceCartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";

const SingleServicePage = () => {
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const lastSlug = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const serviceCart = useSelector((state) => state.serviceCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/services/${lastSlug}`);
        setProduct(response?.data?.data?.doc);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchProduct();
  }, [lastSlug]);

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleAddToCart = () => {
    dispatch(addToServiceCart({ ...product, quantity: quantity }));
    setQuantity(1);
  };

  // Function to increment quantity of an item in the cart
  const handleIncrement = (itemId) => {
    dispatch(updateQuantity({ _id: itemId, quantity: 1 })); // Increase by 1
  };

  // Function to decrement quantity of an item in the cart
  const handleDecrement = (itemId) => {
    dispatch(decreaseQuantity(itemId)); // Decrease by 1
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteFromServiceCart(id));
  };

  return (
    <div className="font-robo">
      <SingleServiceBradCumbs title={product?.heading} img={product?.photo} />
      <Containar>
        <div className="pb-24">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-10">
            <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
              <div className="lg:pt-14">
                <div className="py-4 border-b">
                  <h3 className="relative inline-block text-[26px] font-semibold after:absolute after:left-0 after:-bottom-[18px] after:bg-primary after:w-full after:h-[2px]">
                    Description
                  </h3>
                </div>

                <div className="custom-html-content mt-7 leading-8 text-justify">
                  {product ? (
                    <p dangerouslySetInnerHTML={{ __html: product.details }} />
                  ) : (
                    <Skeleton count={5} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 order-1 lg:order-2">
              <div className="sticky top-40 bg-gradient-to-r from-green-400 to-primary p-6 rounded-lg shadow-md border text-white">
                <div className="text-xl xl:text-2xl font-semibold mb-4">
                  {product?.heading || <Skeleton />}
                </div>
                <div>
                  <button
                    onClick={handleOpenModal}
                    className="w-full bg-white text-primary font-semibold py-3 px-5 rounded-lg shadow-md hover:bg-gray-100 transition"
                  >
                    Purchase This Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Containar>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full">
            <div className="text-xl text-center tracking-wider text-gray-600">
              {product?.heading}
            </div>
            <div className="text-2xl font-bold text-center tracking-wider text-gray-900">
              <FaBangladeshiTakaSign className="inline" /> {product?.price}
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-y-4 lg:gap-y-0 py-4 lg:px-6">
              <div className="lg:w-[30%] pr-4 flex flex-col justify-center">
                <div className="text-lg font-semibold mb-4 text-center">
                  Select Quantity
                </div>
                <div className="flex items-center justify-center mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-primary font-semibold rounded-l-lg"
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(parseInt(e.target.value) || 1, 1))
                    }
                    className="w-16 h-8 text-center border-t border-b border-gray-300 appearance-none no-spinner"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-primary font-semibold rounded-r-lg"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark transition"
                  >
                    Select Service
                  </button>
                </div>
              </div>

              <div className="border-l border-gray-300"></div>

              <div className="lg:w-[70%] pl-4">
                {serviceCart.length === 0 ? (
                  <div className="text-center text-gray-500 font-medium">
                    No items available
                  </div>
                ) : (
                  <>
                    <div className="text-lg font-semibold mb-4 text-center">
                      Total Items
                    </div>
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2">#</th>
                          <th className="border p-2">Name</th>
                          <th className="border p-2">Quantity</th>
                          <th className="border p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceCart.map((item, index) => (
                          <tr key={item._id} className="border-b">
                            <td className="border p-2 text-center">
                              {index + 1}
                            </td>
                            <td className="border p-2 text-center">
                              {item.heading}
                            </td>
                            <td className="border p-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDecrement(item._id)}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 text-primary font-semibold rounded-l-lg"
                                >
                                  <FaMinus />
                                </button>
                                <span className="w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrement(item._id)}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 text-primary font-semibold rounded-r-lg"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </td>
                            <td className="p-2 text-center flex justify-center">
                              <RiDeleteBin6Line
                                onClick={() => handleDeleteItem(item._id)}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Link to="/service-checkout">
                      <button className="w-full mt-5 bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-primary-dark transition">
                        Proceed to checkout
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleServicePage;
