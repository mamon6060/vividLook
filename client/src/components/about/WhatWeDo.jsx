import { GiChestnutLeaf } from "react-icons/gi";
import Containar from "../containar/Containar";
import custom from "../../assets/About/Custom.jpg";
import quality from "../../assets/About/Quality.jpg";
import casee from "../../assets/About/Case.jpg";
import research from "../../assets/About/Research.jpg";

const workData = [
  {
    title: "Custom Solution",
    description:
      "Madina Refrigeration's nutrient solutions are designed to deliver vital elements effectively from the soil to every 	part of the plant.",
    image: custom,
  },
  {
    title: "Research & Developement",
    description:
      "Madina Refrigeration is committed to advancing agricultural innovation through robust research and development efforts",
    image: research,
  },
  {
    title: "Case Studies and Results",
    description:
      "Madina Refrigeration deployed its Growth Booster, a scientifically formulated nutrient solution, tailored to address soil deficiencies and promote plant vitality",
    image: quality,
  },
  {
    title: "Quality Assurance",
    description:
      "Madina Refrigeration prioritizes precision and trust in delivering top-tier products through a rigorous quality assurance process.",
    image: casee,
  },
];

const WhatWeDo = () => {
  return (
    <div className="my-20">
      <Containar>
        <div>
          <div className="flex justify-center">
            <GiChestnutLeaf className="inline-block text-[#F4A51D] text-center w-10 h-10 mb-4" />
          </div>
          <h4 className="text-xl font-bold text-[#F4A51D] text-center mb-10">
            Welcome to{" "}
            <span className="text-primary">Madina Refrigeration!</span>
          </h4>
          <h1 className="text-4xl text-center font-semibold mb-12">
            What We Do Agricultural Work
          </h1>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-5 my-5">
            {workData.map((work, index) => (
              <div className="flex flex-col" key={index}>
                <div className="relative flex justify-center items-center">
                  <div className="absolute w-64 h-64 rounded-full border-4 border-dashed border-yellow-500 animate-spin-slow"></div>
                  <div className="w-60 h-60 rounded-full overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="text-center mt-8">
                  <h1 className="text-2xl font-bold text-primary mb-4">
                    {work.title}
                  </h1>
                  <p className="text-lg leading-7 text-gray-600">
                    {work.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default WhatWeDo;
