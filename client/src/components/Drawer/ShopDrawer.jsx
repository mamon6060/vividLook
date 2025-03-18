/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import React from 'react';
import Drawer from "react-modern-drawer";
import PriceRange from "../shop/PriceRange";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../axios/Axios";

const ShopDrawer = ({ toggleDrawer, lastSlug, isShopDrawerOpen }) => {
  const [categoryList, setCategoryList] = useState([]);
  const getCategory = async () => {
    try {
      const response = await api.get(`/category`);
      setCategoryList(response.data.data.doc);
    } catch (error) {
      // setError(error.message);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <>
      <Drawer
        open={isShopDrawerOpen}
        onClose={toggleDrawer}
        direction="right"
        className="bla bla bla mt-[68px] block lg:hidden"
      >
        <div className="fixed inset-10 top-10 flex items justify-center bg-opacity-50 -z-40 h-screen ">
          <div className="b p-6 rounded-lg shadow-lg w-96">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="uppercase tracking-wide text-[18px] py-3.5 px-3 font-bold">
                Product Category
              </h3>
            </div>
            {/*  */}
            <div className="col-span-3 block lg:hidden">
              <div className="sticky top-10">
                <div className="shadow-md">
                  {categoryList.map((item, index) => (
                    <Link
                      to={`/shop/category/${item?.slug}`}
                      onClick={toggleDrawer}
                      className={`w-full ${
                        item?.slug == lastSlug
                          ? "bg-primary text-white"
                          : "bg-white"
                      }  border-l border-b border-r inline-block`}
                      key={index}
                    >
                      <div>
                        <h3 className="text-[16px] font-semibold uppercase py-3 px-3 ">
                          {item?.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
                <PriceRange />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ShopDrawer;
