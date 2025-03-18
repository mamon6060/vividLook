import icon from "../../assets/home/service_icon.jpg";
import Containar from "../containar/Containar";
import { useEffect, useState } from "react";
import api from "../axios/Axios";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import service from "../../assets/animation/service.json";
import { FiPlus } from "react-icons/fi";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Function to fetch services
  const getServices = async () => {
    try {
      const response = await api.get(`/services`);
      setServices(response.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  // Function to toggle "Show All" state
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // Determine the services to display
  const displayedServices = showAll
    ? services?.doc
    : services?.doc?.slice(0, 8);

  return (
    <div className="relative">
      <Containar>
        <div className="md:mt-12 mt-8">
          <div className="relative">
            {/* <div className="flex justify-center">
              <Lottie animationData={service} className="w-[120px] h-[80px]" />
            </div> */}
            <div className="text-center mt-[-12px]">
              <h5 className="lg:text-2xl md:text-xl text-lg  font-bold  uppercase text-primary">
                Our Services
              </h5>
              <h2 className="text-lg md:px-10 px-6 mx-auto mt-1">
                Provided Top Repair Service by Our Team
              </h2>
            </div>
            {loading ? (
              <div>
                <Skeleton height={480} />
              </div>
            ) : (
              <>
                {services?.doc?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                    {displayedServices?.slice(0, 4).map((service) => (
                      <>
                        <Link to={`/services/${service?._id}`}>
                          <div
                            key={service._id}
                            className="rounded-t border rounded group group-hover:shadow-md duration-300"
                          >
                            <div className="h-[297px] w-full overflow-hidden">
                              <img
                                src={service?.photo}
                                alt={service.heading}
                                className="w-full h-full rounded-t object-cover group-hover:scale-105 duration-300"
                              />
                            </div>

                            <div className="px-4 py-6 border-b-2 border-[#178843] rounded">
                              <h2 className="lg:text-xl md:text-xl text-lg font-medium group-hover:text-[#178843] duration-300">
                                {service.heading}
                              </h2>

                              <p
                                className="md:text-base text-sm line-clamp-2 mt-1"
                                dangerouslySetInnerHTML={{
                                  __html: service.details,
                                }}
                              ></p>
                              <p
                                className="flex items-center text-base mt-2 capitalize group-hover:text-[#178843] duration-300"
                                dangerouslySetInnerHTML={{
                                  __html: "read more +",
                                }}
                              ></p>
                            </div>
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                ) : (
                  <p className="h-32 flex items-center justify-center text-2xl font-semibold text-primary">
                    No Service Available!
                  </p>
                )}

                {/* Show All Button */}
                <div className="flex justify-center mt-6">
                  <Link to="/services">
                    <div
                      onClick={toggleShowAll}
                      className="bg-[#178843] hover:bg-[#24C462] duration-300 cursor-pointer rounded text-[#fff] md:px-6 px-4 py-3 font-medium flex items-center gap-2 justify-center md:mt-2"
                    >
                      <span className="md:text-base text-sm tracking-wider">
                        Show All Services
                      </span>
                      <span className="text-sm">
                        <FiPlus />
                      </span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default Service;
