/* eslint-disable react/prop-types */
import Articles1 from "../../assets/Articles1.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, loading }) => {
  if (loading) {
    // Render skeleton if loading
    return (
      <div className="rounded-lg overflow-hidden pb- bg-white">
        <Skeleton height={280} /> {/* Image Skeleton */}
        <div className="relative">
          <div className="absolute right-3 -bottom-10">
            {/* Circle Skeleton for Date */}
            <Skeleton circle={true} height={80} width={80} />
          </div>
        </div>
        <div className="pl-4 my-7">
          <Skeleton width={100} /> {/* Author name skeleton */}
          <Skeleton height={30} width={200} className="my-4" />{" "}
          <Skeleton count={2} />
          <Skeleton height={40} width={120} className="mt-5" />{" "}
          {/* Button Skeleton */}
        </div>
      </div>
    );
  }
  // Safeguard against missing or undefined blog data
  if (!blog) {
    return <div></div>;
  }

  // Render actual blog card if not loading
  return (
    <div className="rounded-lg overflow-hidden pb- border bg-white w-full">
      <div className="relative">
        <Link to={`/blogs/${blog?.slug || ""}`}>
          <img
            src={blog?.photos?.[0] || Articles1} // Fallback to default image
            alt="Blog Cover"
            className="w-full h-72 object-cover"
          />
        </Link>
        {blog?.date && (
          <div className="bg-primary absolute right-3 -bottom-5 text-white rounded-full w-20 h-20 border-[6px] border-white flex justify-center items-center">
            <p className="text-base font-medium leading-6 text-center">
              {blog.date.split(" ")[1]}
              <br />
              {blog.date.split(" ")[0]}
            </p>
          </div>
        )}
      </div>

      {/* Icon and Content */}
      <div className="text-left pl-4 my-7 w-full">
        <div>{/* <p>{blog?.author || "Unknown Author"}</p> */}</div>
        <Link to={`/blogs/${blog?.slug || ""}`}>
          <h2 className="font-bold text-xl mt-4">
            {blog?.title || "Untitled Blog"}
          </h2>
        </Link>
        <p
          className="text-gray-600 text-sm my-5 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: blog?.content
              ? blog.content.replace(/<\/?[^>]+(>|$)/g, "")
              : "No content available.",
          }}
        />
        <div className="flex justify-between items-center mt-5 w-full">
          <Link to={`/blogs/${blog?.slug || ""}`}>
            <button className="inline-block w-full md:w-auto text-center rounded-md text-white text-[14px] bg-[#178843] px-4 py-1">
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
