import React, { useEffect, useState, useRef } from "react";
import { IoCart } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../axios/Axios";
import { addToAgroCart } from "../../redux/slices/cart/agroCartSlice";
import { useDispatch, useSelector } from "react-redux";

const RelatedProductItems = ({ slug, prevProductId }) => {
  const [products, setProducts] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const handleAddtoCart = (product) => {
    // if(){

    // }
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
    if (token) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };
  const handleBuyNow = (product) => {
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
    // navigate("/checkout");
  };

  // home-appliance-product?category=67d521510d37bce550cf07c3

  // /category/${slug}/products

  console.log("THis is slug", slug);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await api.get(
          `/home-appliance-product?category=${slug}`
        );
        const filteredProducts = response.data.data?.doc?.filter(
          (product) => product.id !== prevProductId // Filter out the previous product
        );
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCategoryProducts();
  }, [slug, prevProductId]);

  // Ensure Swiper can access the navigation buttons after they are rendered
  useEffect(() => {
    if (swiperInstance && swiperInstance.params.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="mt-8 relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        loop={true}
        speed={1000}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
        className="relative"
      >
        {products.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-lg bg-white border group overflow-hidden">
              <div className="relative">
                {/* <Link
                  className="overflow-hidden block "
                  to={`/shop/${item?.slug}`}
                >
                  <img
                    src={item?.photos[0]}
                    alt={item?.title}
                    className="w-full h-full group-hover:scale-105 transition-all ease-linear duration-150 aspect-square rounded-t-lg object-cover"
                  />
                </Link> */}

                <div className="h-[200px] overflow-hidden">
                  <Link to={`/shop/${item?.slug}`}>
                    <img
                      src={item?.photos[0]}
                      alt={item?.title}
                      className="w-full group-hover:scale-105 transition-all ease-linear duration-300 h-full group rounded-none"
                    />
                  </Link>
                </div>
              </div>
              {/* Icon and Content */}
              <div className="mt-7 text-left p-4">
                <Link
                  to={`/shop/${item?.slug}`}
                  className="font-bold text-base capitalize inline-block"
                >
                  {item?.title}
                </Link>
                <p className="text-gray-600 text-sm mt-1">
                  <FaBangladeshiTakaSign className="inline-block" />{" "}
                  {item?.salePrice}{" "}
                  <span className="line-through text-gray-500">
                    {item?.price !== item?.salePrice && item?.price}
                  </span>
                </p>
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={() => handleAddtoCart(item)}
                    className="rounded-full hover:bg-[#24C462] transition-all ease-linear duration-150 text-white bg-[#178843] px-8 py-2 text-sm"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 text-white rounded-full p-1"
                  >
                    <IoCart className="inline w-6 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        className="bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 text-white rounded-full p-2 absolute -left-4 top-1/2 z-10 -translate-y-1/2"
      >
        <FaChevronLeft className="w-5 h-5" />
      </button>
      <button
        ref={nextRef}
        className="bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 text-white rounded-full p-2 absolute -right-4 top-1/2 z-10 -translate-y-1/2"
      >
        <FaChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default RelatedProductItems;
