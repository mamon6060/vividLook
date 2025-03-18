/* eslint-disable no-unused-vars */
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import api from "../axios/Axios";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const BestSellProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/home-appliance-product", {
          params: {
            sort: "-saleNumber",
          },
        });
        setProducts(response.data.data.doc.splice(0, 5));
      } catch (err) {

      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="sticky top-10">
      <div>
        {!loading ? (
          <h3 className="text-[20px] rounded-md px-5 py-2 font-semibold text-white bg-primary w-full">
            Best Sell
          </h3>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 1 }).map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </div>
        )}
      </div>

      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex justify-between items-center py-5 ${index + 1 !== 5 && "border-b"
              }`}
          >
            <div className="w-[25%]">
              <Skeleton height={60} />
            </div>
            <div className="w-[70%]">
              <Skeleton height={20} width={`80%`} />
              <Skeleton height={20} width={`40%`} className="mt-2" />
            </div>
          </div>
        ))
        : products.map((item, index) => (
          <div
            key={item._id}
            className={`flex justify-between items-center py-5 ${index + 1 !== products.length && "border-b"
              }`}
          >
            <div className="w-[25%]">
              <Link to={`/shop/${item?.slug}`}>
                <img
                  className="rounded-md"
                  src={item.photos[0]}
                  alt={item.title}
                />
              </Link>
            </div>
            <div className="w-[70%]">
              <Link
                to={`/shop/${item?.slug}`}
                className="text-[18px] font-semibold mb-2 capitalize"
              >
                {item.title}
              </Link>
              <p className="flex items-center gap-1 text-[18px]">
                <FaBangladeshiTakaSign /> <span>{item.salePrice}</span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BestSellProducts;
