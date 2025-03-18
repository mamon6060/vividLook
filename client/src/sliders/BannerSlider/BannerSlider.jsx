import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./BannerSlider.css";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import Skeleton from "react-loading-skeleton"; //
import "react-loading-skeleton/dist/skeleton.css";

const BannerSlider = ({ bannerData, isLoading }) => {
  const swiperRef = useRef(null);

  return (
    <div className="relative">
      {/* Show skeleton loader when loading */}
      {isLoading ? (
        <div className="bg-[#51C07B]">
          {[...Array(1)].map((_, index) => (
            <Skeleton key={index} height={600} />
          ))}
        </div>
      ) : bannerData?.length > 0 ? (
        <>
          <Swiper
            modules={[Navigation, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            speed={1200}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className=""
          >
            {bannerData.map((banner) => (
              <SwiperSlide key={banner._id}>
                <div>
                  <div className="md:mt-[66px] mt-[30px] w-full">
                    <img
                      src={banner?.photo}
                      alt="banner"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="custom-prev absolute left-8 top-1/2 transform -translate-y-1/2 z-10"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <MdArrowBackIos className="text-2xl" />
          </button>
          <button
            className="custom-next absolute right-8 top-1/2 transform -translate-y-1/2 z-10"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <MdArrowForwardIos className="text-2xl" />
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">No banners available</p>
      )}
    </div>
  );
};

export default BannerSlider;
