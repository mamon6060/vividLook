import farmer1 from "../../assets/About/farmer-1.jpg";
import aboutHeader from "../../assets/About/about_header.jpeg";
import leaf1 from "../../assets/About/Leaf-1.svg";
import Containar from "../containar/Containar";
const AboutIntroduction = () => {
  return (
    <div>
      <Containar>
        <div className="my-24 w-full flex flex-col lg:flex-row justify-between items-center md:gap-10 gap-y-10">
          <div className="lg:w-1/2">
            <h4 className="text-xl font-bold text-[#F4A51D]">
              Welcome to{" "}
              <span className="text-primary">Madina Refrigeration!</span>
            </h4>
            <h1 className="text-4xl font-semibold my-4 mb-8">
              We are building a better future
            </h1>
            <p className="text-lg leading-9 text-gray-500 text-justify">
              Madina Refrigeration is dedicated to delivering high-quality
              repair services and durable components for ACs, fridges, and other
              cooling appliances. Our solutions ensure optimal performance,
              energy efficiency, and extended appliance lifespan, helping
              businesses and households maintain uninterrupted cooling. By
              leveraging advanced techniques and expert craftsmanship, we
              minimize downtime, reduce costs, and enhance customer
              satisfaction. Our commitment to innovation and sustainability
              drives us to promote eco-friendly practices, reduce waste, and
              contribute to a greener future. Through reliable service and
              trusted expertise, we aim to be the go-to partner for all
              refrigeration and cooling needs.
            </p>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src={aboutHeader}
              className="lg:h-[450px] lg:w-[450px] rounded-lg"
            ></img>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default AboutIntroduction;
