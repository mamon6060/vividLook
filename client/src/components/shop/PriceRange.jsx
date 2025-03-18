
import * as Slider from "@radix-ui/react-slider";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {

  setSelectedRange,
} from "../../redux/slices/price/PriceRangeSlice";


const PriceRange = () => {
  const dispatch = useDispatch();
  const { minPrice, maxPrice, selectedRange, status } = useSelector(
    (state) => state.priceRange
  );
  const handlePriceChange = (value) => {
    dispatch(setSelectedRange(value, location?.pathname));
  };

  return (
    <div className="mt-10">
      <div className="shadow-md">
        <div className="w-full bg-white border-l-2 border-t border-b border-r border-l-primary">
          <div>
            <h3 className="uppercase tracking-wide text-[18px] py-3.5 px-3 font-bold">
              Filter by Price
            </h3>
          </div>
        </div>
        <div className="w-full bg-white border-l border-b border-r ">
          <div className="px-3 py-3 pt-6">
            {status === "loading" ? (
              <p>Loading prices...</p>
            ) : (
              <form>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={selectedRange}
                  onValueChange={handlePriceChange}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                >
                  <Slider.Track className="bg-gray-200 relative grow h-[3px]">
                    <Slider.Range className="absolute bg-primary rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-4 h-4 bg-primary cursor-pointer rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-none"
                    aria-label="Min Price"
                  />
                  <Slider.Thumb
                    className="block w-4 h-4 bg-primary cursor-pointer rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-none"
                    aria-label="Max Price"
                  />
                </Slider.Root>
                <div className="flex justify-between mt-3">
                  <button type="button">Filter</button>
                  <h4 className="flex items-center">
                    Price:{" "}
                    <span className="ml-1 flex items-center mr-1">
                      <FaBangladeshiTakaSign className="inline-block text-[14px]" />
                      {selectedRange[0]}
                    </span>
                    -{" "}
                    <span className="mr-1 ml-1 flex items-center">
                      <FaBangladeshiTakaSign className="inline-block text-[14px]" />
                      {selectedRange[1]}
                    </span>
                  </h4>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
