/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import BradCumbs from "../components/shared/BradCumbs";
import Containar from "../components/containar/Containar";
import { FaHome } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { MdAccessTime, MdOutlineWatchLater } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";
import { FaUserPen } from "react-icons/fa6";
import api from "../components/axios/Axios";
import { RiMapPinLine } from "react-icons/ri";

import Skeleton from "react-loading-skeleton"; // Import skeleton loader

import "react-loading-skeleton/dist/skeleton.css";

const SingleEventPage = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [singleEvent, setSingleEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSingleEvent = async (id) => {
    try {
      const response = await api.get(`/events/${id}`);

      setSingleEvent(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getSingleEvent(id);
    }
  }, [id]);

  const getEvents = async () => {
    try {
      const response = await api.get(`/events`);

      setEvents(response.data?.data?.doc.splice(0, 6));

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
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
        title="All Latest Events"
        brad="Latest Events"
        brad2="Single Event"
        bradLink="/events"
      />
      <Containar>
        <div className="grid grid-cols-12 py-20 gap-y-10 md:gap-5 lg:gap-10 font-robo">
          {singleEvent ? (
            <div className="col-span-12 md:col-span-8">
              <div className="mb-10">
                <h2 className="text-[28px] font-semibold leading-[42px]">
                  {singleEvent?.doc?.heading}
                </h2>
                <div className="flex items-center gap-3 mt-3 text-gray-600">
                  <div className="flex">
                    <div className="flex items-center gap-1">
                      <MdAccessTime />
                      <h4>
                        {
                          formatDateWithTime(singleEvent?.doc?.startingDate)
                            .time
                        }
                      </h4>
                    </div>
                    <span className="mx-2 md:hidden lg:inline">|</span>
                    <div className="flex items-center gap-1">
                      <CiCalendarDate />
                      <h4>
                        {
                          formatDateWithTime(singleEvent?.doc?.startingDate)
                            .date
                        }
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  className="w-full"
                  src={singleEvent?.doc?.photo}
                  alt={singleEvent?.doc?.heading}
                />
                <div className="absolute right-5 w-24 h-24 rounded-full flex items-center justify-center bg-white -top-[53px]">
                  <div className="w-20 h-20 rounded-full bg-primary flex justify-center items-center">
                    <div className="text-center text-white font-semibold">
                      <h4>{formatDate(singleEvent?.doc?.startingDate)}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12">
                <h4 className="mt-3 mb-1.5 text-primary text-[20px] font-medium">
                  Location:{" "}
                  <span className="ml-2 text-gray-600 font-normal">
                    {singleEvent?.doc?.location}
                  </span>
                </h4>
                <h4 className="mt-2.5 mb-4 text-primary text-[20px] font-medium">
                  Time:{" "}
                  <span className="ml-2 text-gray-600 font-normal">
                    {formatDateWithTime(singleEvent?.doc?.startingDate).time} :{" "}
                    {formatDateWithTime(singleEvent?.doc?.startingDate).date}
                  </span>
                </h4>
              </div>
              <div
                className="mt-9 text-[14px] leading-[28px] text-justify"
                dangerouslySetInnerHTML={{ __html: singleEvent?.doc?.details }}
              ></div>
            </div>
          ) : (
            // Skeleton loader for the single event details
            <div className="col-span-12 md:col-span-8">
              <Skeleton height={40} count={3} className="mb-4" />
              <Skeleton height={300} className="mb-4" />
              <Skeleton height={50} count={1} className="mb-4" />
              <Skeleton height={20} count={2} />
            </div>
          )}

          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-10">
              <div className="flex justify-between py-3 px-4 bg-primary text-white rounded-md">
                <h3>All Events</h3> <Link to={"/events"}>View All</Link>
              </div>
              {loading ? (
                // Skeleton loader for the events list
                <Skeleton count={3} height={80} className="mt-4" />
              ) : (
                events?.map((event, index) => (
                  <div
                    key={event?._id}
                    onClick={() => getSingleEvent(event?._id)}
                    className={`${
                      events.length !== index + 1 && "border-b"
                    } py-5`}
                  >
                    <div className="flex justify-between">
                      <div className="w-[30%] h-[80px] relative">
                        <Link
                          className="w-full h-full"
                          to={`/events/${event?._id}`}
                        >
                          <img
                            className="w-full h-full object-cover rounded-md"
                            src={event?.photo}
                            alt={event?.heading}
                          />
                        </Link>
                      </div>
                      <div className="w-[65%]">
                        <div className="text-[14px] font-semibold line-clamp-2">
                          <Link className="" to={`/events/${event?._id}`}>
                            {event?.heading}
                          </Link>
                        </div>
                        <div className="text-[13px] mt-2 text-gray-600">
                          <div className="flex items-center md:items-start lg:items-center gap-x-1 mr-2">
                            <MdOutlineWatchLater className="md:mt-1 lg:mt-0" />{" "}
                            <span>
                              {formatDateWithTime(event?.startingDate).time} ,{" "}
                              {formatDateWithTime(event?.startingDate).date}
                            </span>
                          </div>
                          <div className="flex items-center gap-x-1 mt-1">
                            <RiMapPinLine />{" "}
                            <span className="line-clamp-1">
                              {event?.location}
                            </span>
                          </div>
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

export default SingleEventPage;
