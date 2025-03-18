import { useState } from "react";
import Containar from "../containar/Containar";

const AboutValues = () => {
  return (
    <div className="bg-[#FBF7F0] md:py-12">
      <Containar>
        <div className="p-2 lg:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-7 text-justify">
                Our mission at Madina Refrigeration is to provide top-quality repair services and durable components for ACs, 
                fridges, and other cooling appliances, ensuring optimal performance and longevity. We are committed to delivering 
                reliable and efficient solutions that minimize downtime and maximize customer satisfaction. Through expert craftsmanship, 
                innovative techniques, and a customer-first approach, we strive to enhance the comfort and convenience of homes and 
                businesses. Our goal is to contribute to a more sustainable future by promoting energy-efficient solutions, reducing 
                waste, and extending the lifespan of essential appliances. At Madina Refrigeration, we build trust through excellence, 
                ensuring our customers always have a dependable partner for their refrigeration needs.
              </p>
            </div>
            
            {/* Vision Card */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <h2 className="text-3xl font-bold mb-4 text-primary">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-7 text-justify">
                Our vision at Madina Refrigeration is to be the leading provider of reliable repair services and high-quality 
                components for ACs, fridges, and other appliances in Bangladesh. We strive to ensure that homes and businesses 
                experience uninterrupted cooling and efficiency through our expert solutions. By prioritizing innovation, quality, 
                and customer satisfaction, we aim to set the industry standard for excellence. Our goal is to contribute to a 
                sustainable future by extending the lifespan of appliances, reducing waste, and promoting energy-efficient 
                solutions. As we grow, we envision becoming a trusted name in refrigeration and cooling services, delivering 
                long-term value to our customers and communities.
              </p>
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default AboutValues;
