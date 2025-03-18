import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import SinglePageBradCumbs from "../components/shared/SinglePageBradCumbs";
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
import { useLocation, useNavigate } from "react-router-dom";
import api from "../components/axios/Axios";
import BestSellProduct from "../components/shop/BestSellProduct";
import RelatedProductItem from "../components/shop/RelatedProductItem";
import { addToAgroCart } from "../redux/slices/cart/agroCartSlice";
import Skeleton from "react-loading-skeleton";

const SingleShopPage = () => {
  const swiperRef = useRef(null);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState(""); // State for the message
  const location = useLocation();
  const lastSlug = location.pathname.split("/").pop();
  const navigate = useNavigate();

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${lastSlug}`);
        setProduct(response.data.data.product);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchProduct();
  }, [lastSlug]);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      if (value <= product.stock) {
        setQuantity(value);
        setMessage("");
      } else {
        setQuantity(product.stock);
        setMessage("You have reached the maximum available stock.");
      }
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  const handleIncrement = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => (prev === "" ? 1 : prev + 1));
      setMessage("");
    } else {
      setMessage("You have reached the maximum available stock.");
    }
  };

  // Disable the increment button when the quantity reaches the maximum stock
  const isIncrementDisabled = product && quantity >= product.stock;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setMessage("");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToAgroCart({ ...product, quantity }));
      navigate("/checkout");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToAgroCart({ ...product, quantity }));
      setQuantity(1);
    }
  };

  return (
    <div className="font-robo">
      
      <SinglePageBradCumbs title={product?.title} />
      <Containar>
        <div className="pb-24">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-10">
            <div className="col-span-12 lg:col-span-9">
              <div className=" grid grid-cols-12 md:gap-6 lg:gap-12">
                <div className="col-span-12 md:col-span-6">
                  <div className="relative group">
                    <Swiper
                      ref={swiperRef}
                      modules={[Navigation, Pagination]}
                      pagination={{ clickable: true }}
                      spaceBetween={30}
                      slidesPerView={1}
                      className="w-full"
                    >
                      {product?.photos?.length > 0 ? (
                        product.photos.map((item, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={item}
                              className="w-full object-contain"
                              alt="Product"
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <Skeleton height={400} />
                        </SwiperSlide>
                      )}
                    </Swiper>
                    <button
                      className="group-hover:border absolute left-0 top-1/2 -translate-y-1/2 text-gray-60 z-20 px-2 py-2 rounded text-gray-400 hover:bg-primary group-hover:text-white group-hover:border-primary transition duration-300"
                      onClick={handlePrev}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="group-hover:border absolute right-0 top-1/2 -translate-y-1/2 text-gray-60 z-20 px-2 text-gray-400 py-2 rounded hover:bg-primary group-hover:text-white group-hover:border-primary transition duration-300"
                      onClick={handleNext}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div>
                    <h2 className="text-[32px] font-bold capitalize">
                      {product ? product.title : <Skeleton width={200} />}
                    </h2>
                    <h4 className="text-[14px] font-normal mt-5">
                      {product ? (
                        `by Madina`
                      ) : (
                        <Skeleton width={150} />
                      )}
                    </h4>
                    <h4 className="flex gap-1 text-[18px] font-medium items-center mt-12">
                      {product ? (
                        <>
                          <FaBangladeshiTakaSign className="text-primary text-[20px]" />
                          <span className="text-primary text-[24px]">
                            {product.salePrice}
                          </span>
                          {product.salePrice !== product.price && (
                            <span className="line-through ml-2">
                              {product.price}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <Skeleton circle height={20} width={20} />
                          <Skeleton height={24} width={80} />
                          <Skeleton
                            height={24}
                            width={80}
                            style={{ marginLeft: "0.5rem" }}
                          />
                        </>
                      )}
                    </h4>

                    <div className="flex flex-start mt-10">
                      {product ? (
                        <div className="flex items-center gap-2 border">
                          <div
                            className="w-12 h-12 rounded-r-sm border-l flex items-center justify-center text-[20px] cursor-pointer"
                            onClick={handleDecrement}
                          >
                            <FaMinus />
                          </div>
                          <input
                            className="w-16 h-12 text-center outline-none"
                            value={quantity}
                            onChange={handleQuantityChange}
                            type="text"
                          />
                          <div
                            className={`w-12 h-12 rounded-l-sm border-r flex items-center justify-center text-[20px] cursor-pointer ${
                              isIncrementDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={handleIncrement}
                          >
                            <FaPlus />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 border">
                          <Skeleton height={48} width={48} />
                          <Skeleton height={48} width={64} />
                          <Skeleton height={48} width={48} />
                        </div>
                      )}
                    </div>

                    {/* Display message */}
                    {message && (
                      <div className="mt-2 text-sm text-red-500">{message}</div>
                    )}

                    <div className="flex justify-start items-center mt-16">
                      <div className="flex items-center gap-3">
                        {product ? (
                          <>
                            <button
                              className="font-medium px-8 py-2 rounded-md bg-primary text-white text-[16px]"
                              onClick={() => handleBuyNow()}
                            >
                              Buy Now
                            </button>
                            <button
                              className="font-medium px-6 bg-primary rounded-md text-white py-2 text-[16px] flex items-center gap-1"
                              onClick={handleAddToCart}
                            >
                              <span>Add to Cart</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <Skeleton height={48} width={120} />
                            <Skeleton height={48} width={120} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-14">
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
            <div className="col-span-12 lg:col-span-3">
              <BestSellProduct />
            </div>
          </div>
        </div>
      </Containar>
      <div>
        <Containar className={"border-t"}>
          <div className="py-20">
            <h3 className=" text-[30px] font-bold">Related Products</h3>
            <div>
              {/* ------------- */}
              <div>
                {product ? (
                  <RelatedProductItem
                    slug={product.category.slug}
                    prevProductId={product._id}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} height={300} />
                    ))}
                  </div>
                )}
              </div>

              {/* -------------- */}
            </div>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default SingleShopPage;
