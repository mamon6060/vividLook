/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { IoCart } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import {
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import api from "../axios/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToAgroCart } from "../../redux/slices/cart/agroCartSlice";
import SortOption from "./SortOption";
import { FaFilter } from "react-icons/fa6";

import ShopDrawer from "../Drawer/ShopDrawer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchPrices } from "../../redux/slices/price/PriceRangeSlice";

const ProductGridShopPage = () => {
  const [productsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridOrList, setGridOrList] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalProducts] = useState(0);

  const [ setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  selectedRange, status } = useSelector(
    (state) => state.priceRange
  );

  const sortOption = useSelector((state) => state.sort.sortOption);

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

  const fetchProducts = async (page, limit) => {
    setLoading(true);
    try {
      let sort = "";

      // Determine the sort parameter based on the selected sortOption
      if (sortOption === "lowToHigh") {
        sort = "salePrice"; // Ascending order of price
      } else if (sortOption === "highToLow") {
        sort = "-salePrice"; // Descending order of price
      } else if (sortOption === "mostViewed") {
        sort = "-visitCount"; // Descending order of price
      } else if (sortOption === "bestSelling") {
        sort = "-saleNumber"; // Descending order of price
      } else {
        sort = "";
      }

      const response = await api.get(`/home-appliance-product`, {
        params: {
          limit: limit,
          page: page,
          "salePrice[gte]": selectedRange[0],
          "salePrice[lte]": selectedRange[1],
          sort, // Include the sort option in the query params
        },
      });
      setLoading(false);

      setProducts(response.data.totalData);
      console.log("Total Products", response);
      return response.data.data.doc;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();
  useEffect(() => {
    const pathname = location?.pathname?.split("/")[1];
    if (status !== pathname) {
      dispatch(fetchPrices(pathname));
    }
    const loadProducts = async () => {
      const productsData = await fetchProducts(currentPage, productsPerPage);
      setProducts(productsData);
    };

    loadProducts();
  }, [currentPage, productsPerPage, sortOption, selectedRange]);

  const totalPages = useMemo(
    () => Math.ceil(totalProducts / productsPerPage),
    [totalProducts, productsPerPage]
  );

  const getCategory = async () => {
    try {
      const response = await api.get(`/home-appliance-category`);
      setCategoryList(response.data.data.doc);
    } catch (error) {
      // setError(error.message);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const lastSlug = location.pathname.split("/").pop();
  const [isShopDrawerOpen, setShopDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setShopDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="py-4 font-robo px-2 md:px-5 flex justify-between items-center border-b">
        <div className=" flex items-center gap-1 md:gap-2">
          <div
            onClick={() => setGridOrList(true)}
            className={`w-8 h-8 md:w-9 md:h-9 ${
              gridOrList
                ? "bg-primary text-white"
                : "bg-transparent border text-text"
            } flex cursor-pointer justify-center items-center `}
          >
            <BsGrid3X3GapFill className="w-5 h-5" />
          </div>
          <div
            onClick={() => setGridOrList(false)}
            className={`w-8 h-8 md:w-9 md:h-9 border flex ${
              !gridOrList
                ? "bg-primary text-white"
                : "bg-transparent border text-text"
            } cursor-pointer justify-center items-center `}
          >
            <FaList className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 border flex  bg-primary text-white cursor-pointer justify-center items-center lg:hidden">
            <FaFilter onClick={toggleDrawer} className="w-5 h-5" />
          </div>
        </div>

        <SortOption />
      </div>

      {gridOrList ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 xl:gap-5 gap-3 w-full px-5 pb-6">
            {loading
              ? Array.from({ length: productsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg hover:shadow-lg overflow-hidden bg-white group pb-4 border"
                  >
                    <Skeleton height={300} />
                    <div className="px-4">
                      <Skeleton
                        height={20}
                        width={"60%"}
                        className="mt-7 mb-2"
                      />
                      <Skeleton height={20} width={"40%"} />
                      <Skeleton height={30} width={"80%"} className="mt-3" />
                    </div>
                  </div>
                ))
              : products?.map((product, index) => (
                  <div
                    key={index}
                    className="rounded-lg hover:shadow-lg overflow-hidden bg-white group pb-4 border"
                  >
                    <div className="relative">
                      <div className="h-[200px] overflow-hidden">
                        <Link to={`/product/${product?.slug}`}>
                          <img
                            src={product?.photos[0]}
                            alt={product?.title}
                            className="w-full group-hover:scale-105 transition-all ease-linear duration-300 h-full group rounded-none"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="text-left px-4">
                      <h2 className="font-medium  text-[15px] mt-7  capitalize">
                        <Link to={`/product/${product?.slug}`}>
                          {product?.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 text-[15px] flex items-center">
                        <FaBangladeshiTakaSign className="mr-1 text-[12px]" />
                        {product?.discountValue > 0 ? (
                          <>
                            <span className="line-through text-red-500 mr-2">
                              {product?.price}
                            </span>
                            <span>{product?.salePrice}</span>
                          </>
                        ) : (
                          <span>{product?.salePrice}</span>
                        )}
                      </p>
                      <div className="flex  justify-between items-center mt-3">
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="rounded-full text-white bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 px-4 py-1 text-sm"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => handleAddtoCart(product)}
                          className="bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 text-white rounded-full p-1"
                        >
                          <IoCart className="inline w-6 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      ) : (
        <div className="px-5 py-14">
          <div className="flex flex-col gap-y-10">
            {products?.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-x-1 md:gap-x-5 lg:gap-x-10 pb-8 border-b"
              >
                <div className="col-span-12 md:col-span-4">
                  <div className="w-full">
                    <Link to={`${product?.slug}`}>
                      <img
                        src={product?.photos[0]}
                        className="rounded-lg mb-5 md:mb-0"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <Link
                    to={`/shop/${product?.slug}`}
                    className="text-[24px] font-semibold text-text capitalize"
                  >
                    {product?.title}{" "}
                  </Link>
                  <p className="text-gray-600 text-[14px] line-clamp-3 leading-7 mt-5">
                    {product?.details.replace(/<\/?[^>]+(>|$)/g, "")}
                  </p>
                  <p className="flex items-center text-[18px] mt-7">
                    <FaBangladeshiTakaSign className="inline-block mr-1" />
                    {product?.discountValue > 0 ? (
                      <>
                        <span className="line-through text-red-500 mr-2">
                          {product?.price}
                        </span>
                        <span>{product?.salePrice}</span>
                      </>
                    ) : (
                      <span>{product?.salePrice}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-x-2.5 mt-10">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="px-5 rounded-md py-1.5 text-[14px] font-medium bg-primary text-white hover:bg-secondary transition-all ease-linear duration-150"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddtoCart(product)}
                      className="px-5 rounded-md py-1.5 text-[14px] font-medium hover:bg-secondary transition-all ease-linear duration-150 bg-primary text-white"
                    >
                      <IoCart className="inline-block mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalProducts > productsPerPage && (
        <div className="flex justify-center mt-16 pt-12 pb-20">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 text-white bg-primary rounded-lg disabled:bg-gray-400"
          >
            <FaChevronLeft />
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-1 text-white bg-primary rounded-lg disabled:bg-gray-400"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/*------------------------ Modal Part ---------------------*/}
      <ShopDrawer
        toggleDrawer={toggleDrawer}
        lastSlug={lastSlug}
        isShopDrawerOpen={isShopDrawerOpen}
      ></ShopDrawer>
      {/*  */}
    </>
  );
};

export default ProductGridShopPage;
