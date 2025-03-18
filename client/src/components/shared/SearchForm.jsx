import { useEffect, useState } from "react";
import api from "../axios/Axios";
import { Link } from "react-router-dom";

const SearchForm = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null); // For debounce

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("home-appliance-hierarchy");
        const categories = response.data.data;
        categories.push({ _id: "", name: "All Category" });
        setData(categories.reverse());
      } catch (error) {
        console.error("Error during API call:", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle search
  const handleSearch = async () => {
    console.log("---newQuery---2", query);
    if (!query) {
      setSearchData([]); // Clear results if query is empty
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("home-appliance-product/search", {
        query,
        categoryRef: category,
      });
      setSearchData(response?.data?.data?.homeApplianceProducts);
    } catch (error) {
      setSearchData([]);
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Handle input change and debounce API call
  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    console.log("---newQuery---", newQuery);
    setQuery(newQuery);
    if (!newQuery) {
      setSearchData([]); // Clear results if query is empty
      return;
    }
    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(setTimeout(() => handleSearch(), 500)); // Debounce API call
  };

  return (
    <div className=" rounded relative xl:block ">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex w-[100%]">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search..."
            autoComplete="off"
            className="bg-transparent outline-none placeholder-white border-r border-[#fff]/60 text-white w-full md:py-2 py-1 px-1 md:px-4"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent outline-none border-r border-[#fff]/60 px-2 md:py-2 py-1 text-[#fff] md:w-full w-[50%]"
          >
            {data?.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[#51C07B]">
                {cat.name}
              </option>
            ))}
          </select>
          <button
            className="md:py-2 py-1 px-1 md:px-4 text-[12px] text-[#fff]"
            title="Search"
            type="submit"
            onClick={handleSearch}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

        {searchData?.length > 0 && (
          <div className="bg-[#fff] absolute top-10 w-full rounded-b px-2 py-2 border">
            <h2>Products:</h2>
            <div className="flex flex-col gap-2">
              {searchData?.map((product) => (
                <Link
                  key={product?._id}
                  to={`/product/${product?.slug}`}
                  onClick={() => {
                    setSearchData([]);
                    setQuery("");
                  }}
                >
                  <div
                    key={product._id}
                    className="mt-2 flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-[50px] h-[50px] border border-[#262626]/20 shadow-md">
                      <img
                        src={product?.photos[0]}
                        alt="photo"
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-base font-medium">{product?.title}</p>
                      <p className="text-sm mt-1">৳{product?.salePrice}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
