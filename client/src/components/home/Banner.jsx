/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { socialLink } from "../constants";
import { useState, useEffect } from "react";
import Containar from "../containar/Containar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../axios/Axios";
import { Swiper, SwiperSlide } from "swiper/react"; // Updated import
import { EffectFade, Autoplay } from "swiper/modules"; // Updated import
import "swiper/swiper-bundle.css"; // Ensure to include the CSS
import AOS from "aos";
import "aos/dist/aos.css";
import BannerSlider from "../../sliders/BannerSlider/BannerSlider";

const Banner = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bannerData, setBannerData] = useState([]); // State to hold banner data
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations
      easing: "ease-in-out", // Easing function
      once: true, // Whether animation should happen only once while scrolling down
    });
  }, []);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await api.get("/banners");
        const mainBanners = response.data.data.doc
          .reverse()
          .filter((banner) => banner.bannerType === "main");
        setBannerData(mainBanners);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching banner data:", error);
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  return (
    <div className="mt-[-4px]">
      <BannerSlider
        bannerData={bannerData}
        isLoading={isLoading}
      ></BannerSlider>
    </div>
  );
};

export default Banner;
