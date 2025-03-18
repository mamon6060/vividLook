/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import BradCumbs from "../components/shared/BradCumbs";
import Containar from "../components/containar/Containar";
import { Link } from "react-router-dom";
import event1 from "../assets/event/event1.jpg";
import event2 from "../assets/event/event2.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Use FaChevronRight for the next button
import api from "../components/axios/Axios";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Number of events per page
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (page, limit) => {
    try {
      const response = await api.get(`/events?limit=${limit}&page=${page}`);
      return {
        data: response.data.data, // Adjust based on your actual response structure
        total: response.data.totalData, // Total events available in the database
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { data: [], total: 0 }; // Handle errors gracefully
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const res = await fetchEvents(page, limit);
      setEvents(res?.data?.doc);
      setTotalEvents(res.total);
      setLoading(false);
    };

    loadEvents();
  }, [page, limit]);

  // Calculate total pages
  const totalPages = Math.ceil(totalEvents / limit);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatDateWithTime = (dateString) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }), // e.g., "02:30 PM"
      date: `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`, // e.g., "30 September 2024"
    };
  };

  return (
    <div className="font-robo">
      {/* Top Section */}
      <div className="h-[64px] sm:h-[89.4px] bg-primary"></div>
      <BradCumbs title="Madina Events" brad="Events" />
      <div className="py-[60px] sm:py-[100px]">
        <Containar>
          <div className=" lg:p-0">
            <h2 className="mb-20 text-[26px] font-semibold">Our Events</h2>
            {/* {events} */}
            {loading ? (
              <div>
                <Skeleton height={480} />
              </div>
            ) : (
              <>
                {events?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 md:gap-y-32 gap-x-8">
                      {loading
                        ? Array.from({ length: limit }).map((_, index) => (
                            <div key={index}>
                              <div className="h-[228px] w-full relative">
                                <Skeleton
                                  height={228}
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                                <div className="absolute -top-[53px] text-[14px] font-bold flex justify-center items-center px-5 py-5 text-center right-6 w-[90px] h-[90px] bg-primary rounded-full text-white">
                                  <Skeleton
                                    circle={true}
                                    height={93}
                                    width={93}
                                  />
                                </div>
                              </div>
                              <div className="mt-[45px]">
                                <h3 className="text-[24px] text-text leading-[32px] font-semibold">
                                  <Skeleton width={150} />
                                </h3>
                                <h4 className="mt-3 mb-1.5 text-[16px] text-text font-medium">
                                  <Skeleton width={200} />
                                </h4>
                                <h4 className="mt-1.5 mb-4 text-[16px] text-text font-medium">
                                  <Skeleton width={180} />
                                </h4>
                                <p className="text-[14px] leading-7 line-clamp-2 text-gray-600">
                                  <Skeleton count={2} />
                                </p>
                                <div>
                                  <Skeleton width={120} height={36} />
                                </div>
                              </div>
                            </div>
                          ))
                        : events?.map((event) => (
                            <div key={event.id}>
                              <div className="h-[228px] w-full relative">
                                <Link to={`/events/${event?._id}`}>
                                  <img
                                    className="w-full h-full object-cover rounded-2xl"
                                    src={event?.photo}
                                    alt={event.heading}
                                  />

                                  <div className="absolute -top-[73px] text-[14px] font-bold flex justify-center items-center px-5 py-5 text-center right-6 w-[90px] h-[90px] bg-primary rounded-full border-[7px] border-white text-white">
                                    <h4 className="text-[12px] font-semibold">
                                      {formatDate(event?.startingDate)}
                                    </h4>
                                  </div>
                                </Link>
                              </div>
                              <div className="mt-[20px]">
                                <div>
                                  <Link
                                    to={`/events/${event?._id}`}
                                    className="text-[26px] font-medium line-clamp-2"
                                  >
                                    {event?.heading}
                                  </Link>
                                </div>
                                <div>
                                  <h4 className="mt-3 mb-1.5 text-[16px] text-text font-medium">
                                    Location:{" "}
                                    <span className="ml-2 text-gray-600 font-normal">
                                      {event?.location}
                                    </span>
                                  </h4>
                                  <h4 className="mt-1.5 mb-4 text-[16px] text-text font-medium">
                                    Time:{" "}
                                    <span className="ml-2 text-gray-600 font-normal">
                                      {
                                        formatDateWithTime(event?.startingDate)
                                          .time
                                      }
                                      ,{" "}
                                      {
                                        formatDateWithTime(event?.startingDate)
                                          .date
                                      }
                                    </span>
                                  </h4>
                                  <p
                                    className="text-[14px] leading-7 line-clamp-3 text-gray-600"
                                    dangerouslySetInnerHTML={{
                                      __html: event?.details?.replace(
                                        /<[^>]+>/g,
                                        ""
                                      ),
                                    }}
                                  ></p>

                                  <div>
                                    <Link
                                      className="inline-block mt-5 w-full md:w-auto text-center  text-white text-[17px] hover:bg-secondary transition-all ease-linear duration-150 font-semibold px-[28px] py-[5px] bg-primary rounded-lg"
                                      to={`/events/${event?._id}`}
                                    >
                                      Know More
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                    </div>
                    {totalEvents > limit && ( // Only show pagination if there are more than `limit` events
                      <div className="flex justify-center gap-x-6 mt-20">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className={`px-4 py-0.5 text-white ${
                            page === 1 ? "bg-gray-400" : "bg-primary"
                          } rounded-lg`}
                        >
                          <FaChevronLeft />
                        </button>
                        <span className="px-4 py-2">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                          className={`px-4 py-0.5 text-white ${
                            page === totalPages ? "bg-gray-400" : "bg-primary"
                          } rounded-lg`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="h-32 flex items-center justify-center text-2xl font-semibold text-primary">
                    No Events For Now!
                  </p>
                )}
              </>
            )}
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default EventPage;
