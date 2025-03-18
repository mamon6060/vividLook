import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Containar from "../containar/Containar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Marquee from "react-fast-marquee"; // Import react-fast-marquee
import api from "../axios/Axios";

const Partner = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPartners = async () => {
    try {
      const response = await api.get(`/partners`);
      setPartners(response.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartners();
  }, []);

  return (
    <Containar>
      <div className="font-robo">
        {loading ? (
          <div>
            <Skeleton height={200} />
          </div>
        ) : (
          <>
            {partners?.doc?.length > 0 ? (
              <div className="pt-5">
                <h2 className="md:text-xl font-semibold leading-8 sm:leading-[48px] md:mt-16 text-[#178843]">
                  Trusted Client of Madina
                </h2>

                <div className="mt-8 pb-16 ">
                  {/* Add react-fast-marquee */}
                  <Marquee gradient={false} speed={50} pauseOnHover={true}>
                    {partners?.doc?.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-28 h-28 bg-white   flex justify-center items-center mx-5 overflow-hidden p-1"
                      >
                        <Link
                          className="rounded h-[100px] px-2 flex items-center  border border-[#178843]/20"
                          to={"/"}
                        >
                          <img
                            className="w-full rounded"
                            src={item?.photo}
                            alt={`Partner logo ${index + 1}`}
                          />
                        </Link>
                      </div>
                    ))}
                  </Marquee>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No partners found. Please try again later.
              </p>
            )}
          </>
        )}
      </div>
    </Containar>
  );
};

export default Partner;
