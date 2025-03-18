import React, { useEffect, useRef, useState } from "react";
import Containar from "../components/containar/Containar";
import BradCumbs from "../components/shared/BradCumbs";
import HeroBanner from "../components/shop/HeroBanner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaBangladeshiTakaSign, FaChevronRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaChevronLeft, FaList } from "react-icons/fa";
import api from "../components/axios/Axios";
import { Link, Outlet, useLocation } from "react-router-dom";
import PriceRange from "../components/shop/PriceRange";
import { FaFilter } from "react-icons/fa6";
import ServiceShow from "../components/services/ServiceShow";

const Servicepage = () => {
  const swiperRef = useRef(null);
  const [newRelease, setNewRelease] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
  const location = useLocation();

  useEffect(() => {
    getBanners();
    getCategoryList();
  }, []);

  const isCategoryPath = location.pathname.startsWith("/shop/category");

  const categoryName = isCategoryPath ? location.pathname.split("/").pop() : "";

  const getBanners = async () => {
    try {
      const response = await api.get(`/banners`);
      const groupedBanners = response?.data?.data?.doc.reduce((acc, banner) => {
        const { bannerType } = banner;
        if (!acc[bannerType]) {
          acc[bannerType] = [];
        }
        acc[bannerType].push(banner);
        return acc;
      }, {});
      setNewRelease(groupedBanners?.newRelease);
      setDeals(groupedBanners?.deals);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await api.get(`/services-category/services`);
      setCategoryList(response?.data?.data?.categories);
    } catch (error) {
      console.error(error.message);
    }
  };

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

  const lastSlug = location.pathname.split("/").pop();

  return (
    <>
      <Containar>
        <div className="flex gap-2 items-center py-5 md:mt-16 mt-8">
          <Link className="font-medium" to={"/"}>
            Home{" "}
          </Link>
          <FaChevronRight className="text-[12px]" />
          <Link className="font-medium" to={"/services"}>
            Service
          </Link>
          {isCategoryPath && (
            <>
              <FaChevronRight className="text-[12px]" />
              <h3 className="capitalize">{categoryName}</h3>
            </>
          )}
        </div>
      </Containar>

      <div className="py-5 md:py-8 lg:py-14 bg-[#f5f5f5]">
        <Containar>
          <div className="grid grid-cols-12 lg:gap-5">
            <div className="col-span-3">
              <div className="sticky top-[88px]">
                <div>
                  <div className="shadow-md">
                    <div className="w-full bg-white border-l-2 border-t border-b border-r border-l-primary">
                      <div>
                        <h3 className="uppercase tracking-wide text-[12px] lg:text-[18px] py-3.5 px-3 font-bold">
                          All Services
                        </h3>
                      </div>
                    </div>

                    {isLoading ? (
                      <Skeleton count={6} height={50} />
                    ) : (
                      categoryList.map((item, index) => (
                        <div
                          key={index}
                          className={`w-full ${
                            item?.slug === selectedCategory
                              ? "bg-primary text-white"
                              : "bg-white"
                          }  border-l border-b border-r inline-block cursor-pointer`}
                          onClick={() => setSelectedCategory(item?.slug)} // Set selected category
                        >
                          <div>
                            <h3 className="text-[10px] lg:text-[16px] font-semibold uppercase py-3 px-3">
                              {item?.title}
                            </h3>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-9">
              <div className="bg-white w-full">
                <ServiceShow selectedCategory={selectedCategory} />
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </>
  );
};

export default Servicepage;
