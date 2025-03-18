import Containar from "../containar/Containar";
import bdImg from "../../assets/Contact/agriculture-bg.jpg";
import { Link } from "react-router-dom";
import { socialLink } from "../constants/index";

const SocialMediaLinks = () => {
  return (
    // <Containar>
    <div className="my-20 rounded-lg font-robo ">
      <div className="relative">
        <div
          className="h-96 md:h-80 bg-cover bg-fixed "
          style={{ backgroundImage: `url(${bdImg})` }}
        >
          <div className="absolute inset-0 bg-[rgb(0,0,0,.7)]  text-white">
            <div className="relative z-10 pt-10">
              <Containar>
                <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:pt-16 md:gap-8 lg:gap-4 p-3">
                  <div className="w-full lg:max-w-[60%]">
                    <h2 className="font-semibold text-3xl mb-5">Agriculture</h2>
                    <p className="text-lg">
                      Improve agricultural productivity with natural minerals.
                      Maximize soil health, crop yields and animal
                      nutrition with calcium carbonate and other mineral
                      products.
                    </p>
                  </div>
         
                    <div>
                      <h2 className="font-bold text-xl mb-3">Social</h2>
                      <div className="flex gap-3">
                        {/*  */}
                        <ul className="flex items-center flex-wrap gap-x-[14px] mt-3">
                          {socialLink.map((item, index) => {
                            const Icon = item?.icon;
                            return (
                              <li className="text-black" key={index}>
                                <Link
                                  className={`w-10 h-10 justify-center bg-white hover:scale-125 transition-all ease-linear duration-150 items-center flex rounded-full text-[15px] hover:text-white`}
                                  to={item.link}
                                  style={{ color: item?.color }}
                                  target="_blank"
                                >
                                  <Icon />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        {/*  */}
                      </div>
                    </div>
              
                </div>
              </Containar>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </Containar>
  );
};

export default SocialMediaLinks;
