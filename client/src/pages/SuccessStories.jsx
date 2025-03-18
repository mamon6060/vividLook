import React, { useEffect, useState } from "react";
import Containar from "../components/containar/Containar";
import BradCumbs from "../components/shared/BradCumbs";
import { RiDoubleQuotesR } from "react-icons/ri";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import story1 from "../assets/successStories/story1.jpg";
import story2 from "../assets/successStories/story2.jpg";
import story3 from "../assets/successStories/story3.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../components/axios/Axios";

const SuccessStories = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // Number of stories per page
  const [totalEvents, setTotalEvents] = useState(0);
  const [stories, setstories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchstories = async (page, limit) => {
    try {
      const response = await api.get(`/stories?limit=${limit}&page=${page}`);
      return {
        data: response.data.data, // Adjust based on your actual response structure
        total: response.data.totalData, // Total stories available in the database
      };
    } catch (error) {
      console.error("Error fetching stories:", error);
      return { data: [], total: 0 }; // Handle errors gracefully
    }
  };

  useEffect(() => {
    const loadstories = async () => {
      setLoading(true);
      const res = await fetchstories(page, limit);
      setstories(res?.data?.doc);
      setTotalEvents(res?.total);
      setLoading(false);
    };

    loadstories();
  }, [page, limit]);

  const totalPages = Math.ceil(totalEvents / limit);
  return (
    <div className="font-robo mb-10">
      <BradCumbs
        title={"Success Stories of Every Smile"}
        brad={"Success Story"}
      />
      <div className="lg:py-28  ">
        <Containar>
          <h2 className="mb-10 text-[26px] font-semibold mt-10">
            Our Success Story
          </h2>
          {loading ? (
            <div>
              <Skeleton height={480} />
            </div>
          ) : (
            <>
              {stories?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                      // Show Skeleton while loading
                      <>
                        {[1, 2, 3].map((_, idx) => (
                          <div
                            key={idx}
                            className="group hover:shadow-lg transition-all ease-linear duration-150"
                          >
                            <Skeleton height={260} />
                            <div className="px-7 py-6 bg-gray-100 rounded-b-lg">
                              <Skeleton
                                circle={true}
                                height={50}
                                width={50}
                                className="mb-3"
                              />
                              <Skeleton count={3} />
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      stories?.map((story) => (
                        <div
                          key={story?.id}
                          className="group hover:shadow-lg bg-gray-100 hover:bg-white rounded-lg transition-all ease-linear duration-150"
                        >
                          <div
                            onClick={() =>
                              navigate(`/success-stories/${story?._id}`)
                            }
                            className="w-full cursor-pointer rounded-t-lg h-[260px] overflow-hidden"
                          >
                            {story?.photo?.includes("youtube.com") ? (
                              <iframe
                                src={story?.photo}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="rounded-t-lg w-full h-full  group-hover:scale-105  transition-all ease-linear duration-500"
                              ></iframe>
                            ) : (
                              // Otherwise, render the image
                              <img
                                className="w-full h-full object-cover group-hover:scale-105  transition-all ease-linear duration-500 rounded-lg"
                                src={story?.photo}
                                alt={story?.name}
                              />
                            )}
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/success-stories/${story?._id}`)
                            }
                            className="px-7 py-6 relative cursor-pointer transition-all ease-linear duration-150 group-hover:bg-white rounded-b-lg"
                          >
                            <div className="absolute right-5 -top-[28px] flex justify-center items-center bg-white w-14 h-14 rounded-full">
                              <div className="w-[44px] h-[44px] rounded-full bg-primary group-hover:bg-secondary transition-all ease-in duration-150 flex justify-center items-center">
                                <RiDoubleQuotesR className="text-3xl text-white" />
                              </div>
                            </div>
                            <p
                              className="text-[14px] leading-[28px] mt-3 line-clamp-3 text-gray-600"
                              dangerouslySetInnerHTML={{
                                __html: story?.text?.replace(/<[^>]+>/g, ""),
                              }}
                            ></p>

                            <h3 className="text-[16px] font-bold leading-[30px] mt-[20px]">
                              {story?.name}
                            </h3>
                            <h4 className="text-[14px] font-normal text-gray-600">
                              {story?.address}
                            </h4>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {totalEvents > limit && (
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
                  No Stories For Now !
                </p>
              )}
            </>
          )}
        </Containar>
      </div>
    </div>
  );
};

export default SuccessStories;
