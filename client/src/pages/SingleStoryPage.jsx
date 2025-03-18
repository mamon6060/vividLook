import { useEffect, useState } from "react";
import BradCumbs from "../components/shared/BradCumbs";
import Containar from "../components/containar/Containar";
import { FaHome } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";
import api from "../components/axios/Axios";
import Skeleton from "react-loading-skeleton"; // Import skeleton loader
import "react-loading-skeleton/dist/skeleton.css";

const SingleStoryPage = () => {
  const { id } = useParams();
  const [stories, setStories] = useState([]);
  const [singleStorie, setSingleStorie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSingleStorie = async (id) => {
    try {
      const response = await api.get(`/stories/${id}`);
      setSingleStorie(response?.data?.data?.doc);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleStorie(id);
    }
  }, [id]);

  const getStories = async () => {
    try {
      const response = await api.get(`/stories`);
      setStories(response.data?.data.doc.splice(0, 6));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  const formatDateWithTime = (dateString) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      date: `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`,
    };
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <BradCumbs
        title="Success Stories"
        brad="Success Story"
        brad2="Farmer Story"
        bradLink="/success-stories"
      />
      <Containar>
        <div className="grid grid-cols-12 py-20 md:gap-5 lg:gap-10 font-robo">
          <div className="col-span-12 md:col-span-8">
            <div className="">
              {loading ? (
                <Skeleton height={30} count={1} className="mb-2" />
              ) : (
                <h3 className="text-[26px] text-text font-medium">
                  {singleStorie?.name}
                </h3>
              )}
            </div>
            <div className="mb-10">
              <div className="flex items-center mt-3 gap-2 text-gray-600 ">
                {loading ? (
                  <Skeleton width={200} height={20} className="mr-2" />
                ) : (
                  <p className="text-[18px] font-normal flex items-center gap-2 text-gray-600">
                    <FaHome className="inline-block" /> {singleStorie?.address}
                  </p>
                )}
                <div className="flex items-center gap-1 mr-1">
                  {loading ? (
                    <Skeleton width={50} height={20} className="mr-2" />
                  ) : (
                    <h4>
                      {singleStorie &&
                        formatDateWithTime(singleStorie.createdAt).time}
                    </h4>
                  )}
                </div>
                |
                <div className="flex items-center gap-1 ml-1">
                  {loading ? (
                    <Skeleton width={70} height={20} className="ml-2" />
                  ) : (
                    <h4>
                      {singleStorie &&
                        formatDateWithTime(singleStorie.createdAt).date}
                    </h4>
                  )}
                </div>
              </div>
            </div>
            <div className="h-[500px]">
              {loading ? (
                <Skeleton height={500} className="rounded-lg" />
              ) : singleStorie?.photo?.includes("youtube.com") ? (
                <iframe
                  src={singleStorie?.photo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg w-full h-full group-hover:scale-105 transition-all ease-linear duration-500"
                ></iframe>
              ) : (
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-all ease-linear duration-500 rounded-t-lg"
                  src={singleStorie?.photo}
                  alt={singleStorie?.title}
                />
              )}
            </div>

            <div
              className="mt-8 text-[14px] leading-[28px] text-justify"
              dangerouslySetInnerHTML={{
                __html: loading
                  ? '<div style="height: 28px;"></div>' // Placeholder for skeleton while loading
                  : singleStorie?.text?.replace(/<[^>]+>/g, ""),
              }}
            ></div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24">
              <div className="flex justify-between py-3 px-4 bg-primary text-white rounded-md">
                <h3>Related Story</h3>{" "}
                <Link to={"/success-stories"}>View All</Link>
              </div>
              {stories?.map((story, index) => (
                <div
                  key={story?._id}
                  className={`py-5 ${
                    stories?.length !== index + 1 && "border-b"
                  } `}
                >
                  {loading ? (
                    <Skeleton height={80} className="rounded-lg mb-2" />
                  ) : (
                    <Link to={`/success-stories/${story?._id}`}>
                      <div className="flex justify-between">
                        <div className="w-[30%] relative">
                          {story?.photo?.includes("youtube.com") ? (
                            <div className="relative w-full h-[80px] rounded-lg">
                              <iframe
                                className="w-full h-full rounded-lg pointer-events-none"
                                src={story?.photo}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : (
                            <img
                              className="w-full h-[80px] object-cover rounded-md"
                              src={story?.photo}
                              alt={story?.name}
                            />
                          )}
                        </div>
                        <div className="w-[65%]">
                          <div
                            className="text-[14px] font-semibold line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: loading
                                ? '<div style="height: 20px;"></div>' // Placeholder for skeleton while loading
                                : story?.text?.replace(/<[^>]+>/g, ""),
                            }}
                          ></div>

                          <div className="mt-2 text-[12px]">
                            {loading ? (
                              <Skeleton
                                height={15}
                                width={100}
                                className="mb-1"
                              />
                            ) : (
                              <>
                                <h4>{story?.name}</h4>
                                <p>{story?.address}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Containar>
    </>
  );
};

export default SingleStoryPage;
