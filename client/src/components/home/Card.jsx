/* eslint-disable react/no-unknown-property */
import service1 from "../../assets/service-1.png";
import service2 from "../../assets/service-4 1.png";
import service3 from "../../assets/service-3.png";
import service4 from "../../assets/service-4.png";
// import leafIcon from "../../assets/leaf-icon.png";
import Containar from "../containar/Containar";
import { PiTractorFill } from "react-icons/pi";
import { GiChicken } from "react-icons/gi";

const Card = () => {
  return (
    <div className="bg-[#FBF7F0] font-robo">
      <Containar>
        <div className="py-[105px]">
          <div className="text-center">
            <div className="flex justify-center">
              {/* <img src={leafIcon} alt="leaf-icon" /> */}
            </div>
            <div className="text-center my-7 ">
              <h5 className="text-[21px] font-semibold mb-4 uppercase">
                Our Agricultural Company
              </h5>
              <h2 className="text-3xl font-bold px-10 leading-[47px]">
                We’re a World-Leading Provider of <br></br> Organic Products &
                Service
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full items-center  my-16">
              <div className="rounded-lg overflow-hidden bg-white pb-10 group">
                <img
                  src={service1} // Replace with the actual image source
                  alt="Soil Testing"
                  className="w-full h-60 rounded-none object-cover"
                />

                <div className="-mt-10 text-center">
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-primary group-hover:bg-[#DCB000]  text-white rounded-full w-[82px] h-[82px] flex justify-center items-center  border-4 border-white">
                      <PiTractorFill className="w-10 h-10" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-semibold text-2xl mb-3 robo">
                    Agriculture Essential
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mx-16">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Sed do eiusmod tempor.
                  </p>
                </div>
              </div>
              <div className=" rounded-lg overflow-hidden  bg-white">
                {/* Image */}
                <img
                  src={service2} // Replace with the actual image source
                  alt="Soil Testing"
                  className="w-full h-60 object-cover"
                />

                {/* Icon and Content */}
                <div className="-mt-10 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary text-white rounded-full w-[82px] h-[82px] border-4 border-white flex justify-center items-center">
                      <GiChicken className="w-10 h-10" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-semibold text-2xl mb-3 leading-6">
                    Soil Testing
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm px-16">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Sed do eiusmod tempor.
                  </p>
                </div>
              </div>
              <div className=" rounded-lg overflow-hidden  bg-white">
                {/* Image */}
                <img
                  src={service3} // Replace with the actual image source
                  alt="Farming Facilites"
                  className="w-full h-60 object-cover"
                />

                {/* Icon and Content */}
                <div className="-mt-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-500 text-white rounded-full p-4 border-4 border-white">
                      <GiChicken />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-xl mb-2">Farming Facilites</h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm px-10">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Sed do eiusmod tempor.
                  </p>
                </div>
              </div>
              <div className=" rounded-lg overflow-hidden  bg-white">
                {/* Image */}
                <img
                  src={service4} // Replace with the actual image source
                  alt="Soil Testing"
                  className="w-full h-60 object-cover"
                />

                {/* Icon and Content */}
                <div className="-mt-4 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-500 text-white rounded-full p-4 border-4 border-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7 12h.01M7 16h.01M7 8h.01"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-xl mb-2">Madina Training</h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm px-10">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Sed do eiusmod tempor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default Card;
