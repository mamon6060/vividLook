import { useEffect, useState, useRef } from "react";
import BlogCard from "../components/blog/BlogCard";
import Containar from "../components/containar/Containar";
import { FaSearch } from "react-icons/fa";
import BradCumbs from "../components/shared/BradCumbs";
import mixitup from "mixitup";
import api from "../components/axios/Axios";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("*");
  const containerRef = useRef(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // const router = useRouter();

  const getBlogs = async () => {
    try {
      const response = await api.get(`/blogs?page=${currentPage}&limit=20`);
      const formattedBlogs = response.data?.data?.doc?.map((blog) => ({
        id: blog?._id,
        title: blog?.title,
        author: blog?.author?.name,
        category: blog?.category?.slug,
        photos: blog?.photos,
        content: blog?.content,
        date: new Date(blog.createdAt).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        slug: blog?.slug,
      }));
      const categoryMap = new Map();
      response.data?.data?.doc?.forEach((blog) => {
        const slug = blog?.category?.slug;
        const title = blog?.category?.title;
        if (!categoryMap.has(slug)) {
          categoryMap.set(slug, title);
        }
      });
      const uniqueCategories = Array.from(categoryMap, ([slug, title]) => ({
        slug,
        title,
      }));
      setUniqueCategories(uniqueCategories);
      setBlogs(formattedBlogs);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    // Initialize MixItUp when the component mounts and blogs are loaded
    let mixer;
    if (containerRef.current) {
      mixer = mixitup(containerRef.current, {
        selectors: {
          target: ".mix", // Target items with class `mix`
        },
        animation: {
          duration: 300,
        },
      });
    }

    return () => {
      // Clean up MixItUp instance on component unmount
      if (mixer) {
        mixer.destroy();
      }
    };
  }, [blogs]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Function to handle search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const res = await api(`/search/blogs?query=${value}`);
      setResults(res?.data?.data?.blogs);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleResultClick = (slug) => {
    window.location.href = `/blogs/${slug}`;
    setShowDropdown(false);
  };

  return (
    <>
      <BradCumbs title="Madina Blogs & Latest News" brad="Blog & News" />
      <Containar>
        <div className="my-10 py-10 w-full">
          <div className="py-4 bg-primary px-3 sm:px-6 rounded-lg flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-[24px] text-white font-semibold">
              Latest Blog & News
            </h2>
            <div className="relative mt-5 sm:mt-0">
              <input
                placeholder="Search Blog"
                className="w-full sm:w-[360px] rounded-md py-2 px-3 outline-none"
                type="text"
                value={query}
                onChange={handleSearch}
              />
              <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600" />

              {showDropdown && results.length > 0 && (
                <div className="absolute w-full bg-white mt-2 rounded-md shadow-lg max-h-[200px] overflow-y-auto z-10">
                  {results.slice(0, 3).map((result, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleResultClick(result?.slug)}
                    >
                      {result.title}
                    </div>
                  ))}
                  {results.length > 3 && (
                    <div className="p-2 text-center text-sm text-gray-500">
                      Scroll for more results...
                    </div>
                  )}
                  {results.slice(3).map((result, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleResultClick(result?.slug)}
                    >
                      {result.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <h3 className="text-[32px] text-center font-semibold text-text mt-20">
            All Blogs
          </h3>
          {loading ? (
            <div>
              <Skeleton height={480} />
            </div>
          ) : (
            <>
              <div>
                <div className="flex justify-center mt-6">
                  {uniqueCategories.length > 0 ? (
                    <ul className="flex flex-wrap items-center gap-4">
                      <li className="cursor-pointer">
                        <button
                          type="button"
                          data-filter="*"
                          className={`py-1 px-5 rounded-md transition-colors duration-300 ${
                            activeFilter === "*"
                              ? "bg-primary text-white"
                              : "bg-gray-300 text-gray-900"
                          }`}
                          onClick={() => handleFilterClick("*")}
                        >
                          All
                        </button>
                      </li>
                      {uniqueCategories?.map((category) => (
                        <li key={category} className="cursor-pointer">
                          <button
                            type="button"
                            data-filter={`.${category?.slug}`}
                            className={`py-1 px-5 rounded-md transition-colors duration-300 ${
                              activeFilter === `.${category?.slug}`
                                ? "bg-primary text-white"
                                : "bg-gray-300 text-gray-900"
                            }`}
                            onClick={() =>
                              handleFilterClick(`.${category?.slug}`)
                            }
                          >
                            {category?.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div
                ref={containerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full my-10"
              >
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div key={blog.id} className={`mix ${blog.category}`}>
                      <BlogCard key={blog.id} blog={blog} loading={loading} />
                    </div>
                  ))
                ) : (
                  <p className="h-32 flex items-center justify-center text-2xl font-semibold text-primary">
                    No Blogs Available Now!
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </Containar>
    </>
  );
};

export default Blogs;
