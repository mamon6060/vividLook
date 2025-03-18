// import Containar from "../components/containar/Containar";
import { Link } from "react-router-dom";
import notFound from "../assets/404/404.png";
import { FaArrowRight } from "react-icons/fa";
import image from "../assets/404/404.gif";
import Containar from "../components/containar/Containar";

const NotFound = () => {
  return (
    <div className="font-robo tracking-wide">
      <div className=""></div>
      <Containar>
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center">
          <div className="relative">
            <h3 className="text-[120px] text-center absolute left-1/2 -top-10 -translate-x-1/2 z-20 ">
              404
            </h3>
            <div>
              <img className="-z-20" src={image} />
            </div>
            <div className="text-center absolute bottom-10 left-1/2 -translate-x-1/2">
              <h3 className="text-[20px]">Look like you're lost</h3>

              <p className="mt-2 mb-6">
                the page you are looking for not avaible!
              </p>

              <Link
                to={"/"}
                className="px-6 py-2 bg-primary text-white rounded-md "
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default NotFound;
