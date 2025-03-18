import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./shop.css";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function HeroBanner({ newRelease }) {
  const isLoading = !newRelease || newRelease.length === 0;

  return (
    <div className="relative h-screen herobanner">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        speed={1000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="mySwiper h-[480px]"
      >
        {/* If data is still loading, show skeletons */}
        {isLoading
          ? Array(3)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <Skeleton height={480} />
                </SwiperSlide>
              ))
          : newRelease?.map((newRelease) => (
              <SwiperSlide key={newRelease?._id}>
                <Link to={newRelease?.link}>
                  <div
                    className="relative h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${newRelease?.photo})` }}
                  ></div>
                </Link>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
