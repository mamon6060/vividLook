/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { IoCart } from "react-icons/io5";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { FaList } from "react-icons/fa";
import {
  FaBangladeshiTakaSign,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa6";
import api from "../axios/Axios";
import { useDispatch, useSelector } from "react-redux";
import { addToAgroCart } from "../../redux/slices/cart/agroCartSlice";
import SortOption from "./SortOption";
import ShopDrawer from "../Drawer/ShopDrawer";

const ProductShop = () => {
  const [productsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [gridOrList, setGridOrList] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { selectedRange, minPrice, maxPrice } = useSelector(
    (state) => state.priceRange
  );
  const sortOption = useSelector((state) => state.sort.sortOption);

  const handleAddtoCart = (product) => {
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
  };
  const handleBuyNow = (product) => {
    dispatch(addToAgroCart({ ...product, quantity: 1 }));
    // if (token) {
    //   navigate("/checkout");
    // } else {
    //   navigate("/login");
    // }
    navigate("/checkout");
  };

  const lastSlug = location.pathname.split("/").pop();
  const { cgId, subCgId, childCagId } = useParams();
  console.log("cgId, subCgId, childCagId ", cgId, subCgId, childCagId);
  // Fetch products function
  const fetchProducts = async (page, limit, cgId, subCgId) => {
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
      }

      // const response = await api.get(`/home-appliance-product`, {
      //   params: {
      //     category:cgId,
      //     subcategory: subCgId,
      //     limit: limit,
      //     page: page,
      //     // "price[gte]": selectedRange[0],
      //     // "price[lte]": selectedRange[1],
      //     sort,
      //   },
      // });
      const params = {
        limit: limit,
        page: page,
        sort: sort,
      };
      if (cgId !== "null") {
        params.category = cgId;
      }
      if (subCgId !== "null") {
        params.subcategory = subCgId;
      }
      if (childCagId !== "null") {
        params.subchildcategory = childCagId;
      }

      // Optionally, add price range if selectedRange is defined
      // if (selectedRange) {
      //   params["price[gte]"] = selectedRange[0];
      //   params["price[lte]"] = selectedRange[1];
      // }

      const response = await api.get(`/home-appliance-product`, { params });
      console.log(" =============== response ", response);
      setTotalProducts(response?.data?.data?.doc); // Update total products
      return response?.data?.data?.doc;
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Handle errors gracefully
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await fetchProducts(
        currentPage,
        productsPerPage,
        cgId,
        subCgId
      );
      setProducts(productsData);
    };

    loadProducts();
  }, [currentPage, productsPerPage, cgId, subCgId, selectedRange, sortOption]);

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const [isShopDrawerOpen, setShopDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setShopDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="py-4 font-robo md:px-5 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <div
            onClick={() => setGridOrList(true)}
            className={`w-9 h-9 ${
              gridOrList
                ? "bg-primary text-white"
                : "bg-transparent border text-text"
            } flex cursor-pointer justify-center items-center`}
          >
            <BsGrid3X3GapFill className="w-5 h-5" />
          </div>
          <div
            onClick={() => setGridOrList(false)}
            className={`w-9 h-9 border flex ${
              !gridOrList
                ? "bg-primary text-white"
                : "bg-transparent border text-text"
            } cursor-pointer justify-center items-center`}
          >
            <FaList className="w-5 h-5" />
          </div>
          <div className="w-9 h-9 border flex  bg-primary text-white cursor-pointer justify-center items-center md:hidden">
            <FaFilter onClick={toggleDrawer} className="w-5 h-5" />
          </div>
        </div>
        <SortOption />
      </div>

      {gridOrList ? (
        <div className="mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 w-full px-5 pb-6">
            {products?.map((product, index) => (
              <div
                key={index}
                className="rounded-lg hover:shadow-lg overflow-hidden bg-white group pb-4 border"
              >
                <div className="relative">
                  <div className="h-[200px] overflow-hidden">
                    <Link to={`/shop/${product?.slug}`}>
                      <img
                        src={product?.photos[0]}
                        alt={product?.title}
                        className="w-full group-hover:scale-105 transition-all ease-linear duration-300 h-full group rounded-none object-cover"
                      />
                    </Link>
                  </div>
                </div>
                <div className="text-left px-4">
                  <h2 className="font-medium text-[15px] mt-7  capitalize">
                    <Link to={`/product/${product?.slug}`}>
                      {product?.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-[15px] flex items-center">
                    <FaBangladeshiTakaSign className="mr-1" />
                    {product?.discountValue > 0 ? (
                      <>
                        <span className="line-through text-red-500  mr-2">
                          <span className="text-[18px]"></span> {product?.price}
                        </span>
                        <span>
                          <span className="text-[20px]"></span>{" "}
                          {product?.salePrice}
                        </span>
                      </>
                    ) : (
                      <span>
                        <span className="text-[20px]"></span>{" "}
                        {product?.salePrice}
                      </span>
                    )}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="rounded-full text-white bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 px-4 py-1 text-sm"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddtoCart(product)}
                      className="bg-[#178843] hover:bg-[#24C462] transition-all ease-linear duration-150 text-white rounded-full px-1.5 py-1"
                    >
                      <IoCart className="inline w-5 h-4" />
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
                className="grid grid-cols-12 lg:gap-x-10 pb-8 border-b"
              >
                <div className="col-span-12 md:col-span-4">
                  <div className="w-full">
                    <Link to={`/shop/${product?.slug}`}>
                      <img src={product?.photos[0]} className="rounded-lg" />
                    </Link>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <Link
                    to={`/shop/${product?.slug}`}
                    className="text-[24px] font-semibold text-text capitalize"
                  >
                    {product?.title}
                  </Link>

                  <p className="text-gray-600 text-[14px] line-clamp-3 leading-7 mt-3">
                    {product?.details.replace(/<\/?[^>]+(>|$)/g, "")}
                  </p>
                  <p className="flex items-center text-[18px] mt-5">
                    <FaBangladeshiTakaSign className="inline-block mr-1" />
                    {product?.discountValue > 0 ? (
                      <>
                        <span className="line-through text-red-500 mr-2">
                          <span className="text-[18px]"></span> {product?.price}
                        </span>
                        <span>
                          <span className="text-[20px]"></span>{" "}
                          {product?.salePrice}
                        </span>
                      </>
                    ) : (
                      <span>
                        <span className="text-[20px]"></span>{" "}
                        {product?.salePrice}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-x-2.5 mt-7">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="px-5 rounded-md py-1.5 text-[14px] font-medium bg-primary text-white hover:bg-[#24C462] transition-all ease-linear duration-150"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleAddtoCart(product)}
                      className="px-5 rounded-md py-1.5 text-[14px] font-medium hover:bg-[#24C462] transition-all ease-linear duration-150 bg-primary text-white"
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

      {/* Pagination Controls */}
      {products?.length == 0 && (
        <h3 className="text-[32px] text-gray-400 text-center font-medium pb-28">
          Product Not Found
        </h3>
      )}
      {/* {totalPages != 0 && (
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
      )} */}
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

      <ShopDrawer
        toggleDrawer={toggleDrawer}
        lastSlug={lastSlug}
        isShopDrawerOpen={isShopDrawerOpen}
      ></ShopDrawer>
    </>
  );
};

export default ProductShop;
