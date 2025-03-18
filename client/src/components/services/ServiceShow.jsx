import React, { useEffect, useState, useRef } from "react";
import ServiceCard from "./ServiceCard";
import api from "../axios/Axios";
import { Link } from "react-router-dom";

const ServiceShow = ({ selectedCategory }) => {
  const [services, setServices] = useState([]);
  const categoryRefs = useRef({}); // Refs for each category section

  useEffect(() => {
    getService();
  }, []);

  useEffect(() => {
    if (selectedCategory && categoryRefs.current[selectedCategory]) {
      // Get the position of the selected category's section
      const sectionTop = categoryRefs.current[selectedCategory].offsetTop;
      const offset = 150;
      window.scrollTo({
        top: sectionTop - offset,
        behavior: "smooth",
      });
    }
  }, [selectedCategory]);

  const getService = async () => {
    try {
      const response = await api.get(`/services-category/services`);
      setServices(response?.data?.data?.result);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="mx-auto px-4">
        <div className="text-lg lg:text-2xl font-medium">
          {services?.map((item, key) => (
            <div
              key={key}
              ref={(el) => (categoryRefs.current[item.slug] = el)} // Assign ref to each category section
              className="space-y-5 mb-8"
            >
              <div>{item.title}</div>
              <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                {item?.services?.map((service) => (
                  <>
                    <Link to={`/services/${service?._id}`}>
                      <ServiceCard
                        key={service?._id}
                        title={service?.heading}
                        image={service?.photo}
                      />
                    </Link>
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceShow;
