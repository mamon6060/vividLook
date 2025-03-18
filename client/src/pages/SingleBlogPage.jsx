/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import BradCumbs from "../components/shared/BradCumbs";
import Containar from "../components/containar/Containar";
import { FaHome } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { MdAccessTime } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { FaUserPen } from "react-icons/fa6";
import api from "../components/axios/Axios";
import Skeleton from "react-loading-skeleton"; // Import skeleton loader
import "react-loading-skeleton/dist/skeleton.css";

const SingleBlogPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSingleBlog = async (slug) => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      setSingleBlog(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      getSingleBlog(slug);
    }
  }, [slug]);

  const getBlogs = async () => {
    try {
      const response = await api.get(`/blogs`);
      setBlogs(response.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

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
      }),
      date: `${date.getDate()} ${date.toLocaleString("en-US", {
        month: "long",
      })} ${date.getFullYear()}`,
    };
  };

  return (
    <div>
      <BradCumbs
        title="Latest Blogs & News"
        brad="Latest Blogs & News"
        brad2="Single Blog"
        bradLink="/blogs"
      />
      <Containar>
        <div className="grid grid-cols-12 py-20 gap-y-10 md:gap-5 lg:gap-10 font-robo">
          <div className="col-span-12 md:col-span-8">
            <div className="mb-10">
              {loading ? (
                <Skeleton height={40} width={`60%`} />
              ) : (
                <h2 className="text-[28px] font-semibold leading-[42px]">
                  {singleBlog?.blog?.title}
                </h2>
              )}
              <div className="flex items-center gap-3 mt-3 text-gray-600 mb-20">
                {loading ? (
                  <>
                    <Skeleton circle height={20} width={20} />
                    <Skeleton width={100} />
                    <Skeleton width={50} />
                    <Skeleton width={50} />
                  </>
                ) : (
                  <>
                    {/* <div className="flex items-center gap-2">
                      <FaUserPen />
                      <h3>{singleBlog?.blog?.author?.name}</h3>
                    </div>
                    | */}
                    <div className="flex  ">
                      <div className="flex items-center gap-1 mr-2">
                        <MdAccessTime />
                        <h4>
                          {formatDateWithTime(singleBlog?.blog?.createdAt).time}
                        </h4>
                      </div>
                      |
                      <div className="flex items-center gap-1 ml-2">
                        <CiCalendarDate />
                        <h4>
                          {formatDateWithTime(singleBlog?.blog?.createdAt).date}
                        </h4>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              {loading ? (
                <Skeleton height={300} />
              ) : (
                <img
                  className="w-full rounded-lg"
                  src={singleBlog?.blog?.photos[0]}
                  alt={singleBlog?.blog?.title}
                />
              )}
              <div className="absolute right-10 w-24 h-24 rounded-full flex items-center justify-center bg-white -top-[53px]">
                {loading ? (
                  <Skeleton circle height={80} width={80} />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary flex justify-center items-center">
                    <div className="text-center text-white font-semibold">
                      <h4>{formatDate(singleBlog?.blog?.createdAt)}</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 text-[14px] leading-[28px] text-justify">
              {loading ? (
                <Skeleton count={5} />
              ) : (
                singleBlog?.blog?.content.replace(/<\/?[^>]+(>|$)/g, "")
              )}
            </div>

            <div className="mt-5">
              <ul className="flex items-center gap-2 text-text">
                {loading ? (
                  <Skeleton count={3} height={25} width={80} />
                ) : (
                  singleBlog?.blog?.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="py-0.5 px-4 bg-gray-100 rounded-md"
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24">
              <div className="flex justify-between py-3 px-4 bg-primary text-white rounded-md">
                <h3>Related Blogs & News</h3>
                <Link to={"/blogs"}>View All</Link>
              </div>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="py-5 border-b">
                    <Skeleton height={100} />
                  </div>
                ))
              ) : (
                blogs?.doc?.map((blog, index) => (
                  <div
                    key={index}
                    onClick={() => getSingleBlog(blog?.slug)}
                    className={`py-5 ${blogs?.doc.length !== index + 1 && "border-b"}`}
                  >
                    <div className="flex justify-between">
                      <div className="w-[30%] h-[86px] relative">
                        <Link to={`/blogs/${blog?.slug}`}>
                          <img
                            className="w-full h-full object-cover rounded-md"
                            src={blog?.photos[0]}
                            alt={blog?.title}
                          />
                        </Link>
                      </div>
                      <div className="w-[65%]">
                        <Link
                          to={`/blogs/${blog?.slug}`}
                          className="text-[18px] line-clamp-1 font-semibold"
                        >
                          {blog?.title}
                        </Link>
                        <div className="mt-2 text-[12px]">
                          <div className="flex flex-row md:flex-col lg:flex-row">
                            <div className="flex items-center gap-1">
                              <MdAccessTime />
                              <h4>{formatDateWithTime(blog?.createdAt).time}</h4>
                            </div>
                            <span className="mx-2 md:hidden lg:inline">|</span>
                            <div className="flex items-center gap-1">
                              <CiCalendarDate />
                              <h4>{formatDateWithTime(blog?.createdAt).date}</h4>
                            </div>
                          </div>
                          {/* <h4 className="mt-1">{blog?.author?.name}</h4> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default SingleBlogPage;
