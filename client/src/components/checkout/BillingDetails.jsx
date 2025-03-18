import { DatePicker, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import moment from "moment";
import api from "../axios/Axios";
import dayjs from "dayjs";
import axios from "axios";
import LocationSelector from "../test/district";
const format = "HH:mm:ss";
import { DistrictSelect, DivisionSelect, UpazilaSelect } from "bd-geo-info";

const BillingDetails = ({
  checkoutType,
  billingDetails,
  handleChange,
  errors,
  selectedLocation,
  handleLocationChange,
}) => {
  // State for date and time range
  const [formData, setFormData] = useState({
    date: null,
    startTime: null, // Separate start time
    endTime: null, // Separate end time
  });

  // Handle date change
  const handleDateChange = (date) => {
    // const formattedDate = date ? moment(date).format("YYYY-MM-DD") : null; // Format date as YYYY-MM-DD
    setFormData((prev) => ({ ...prev, date }));
    handleChange({ target: { name: "bookingDate", value: date } }); // Update bookingDate in billingDetails
  };

  const startTime = dayjs("12:00", "HH:mm");
  const endTime = dayjs("12:00", "HH:mm");

  // Handle time range change
  const handleStartTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, startTime: time })); // Update start time in state
    // const formattedStartTime = time ? moment(time).format("hh:mm A") : null; // Format start time as hh:mm A
    handleChange({
      target: { name: "bookingStartTime", value: time },
    }); // Update bookingStartTime in billingDetails
  };

  const handleEndTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, endTime: time })); // Update end time in state
    const formattedEndTime = time ? moment(time).format("hh:mm A") : null; // Format end time as hh:mm A
    handleChange({
      target: { name: "bookingEndTime", value: formattedEndTime },
    }); // Update bookingEndTime in billingDetails
  };

  const handleTimeRangeChange = (time, timeString) => {
    console.log("Selected Time (moment objects):", time);
    console.log("Selected Time (formatted strings):", timeString);

    // Format the time in 12-hour format with AM/PM
    const formattedTime = timeString.map((t) =>
      moment(t, "HH:mm").format("hh:mm A")
    );
    console.log("Formatted Time:", formattedTime);

    // Update the state or handle the formatted time
    handleChange({
      target: {
        name: "bookingTime",
        value: formattedTime, // Use the formatted time
      },
    });
  };

  // State to manage the selected district, thana, and area
  const [districtList, setDistrictList] = useState([]);
  const [thanaList, setThanaList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [upazilaList, setUpazilaList] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  console.log("This is the selected selectedDistrict", selectedDistrict);
  // division: "",
  // district: "",
  // upazilla: "",
  // area: "",
  useEffect(() => {
    if (selectedDivision) {
      handleChange({
        target: { name: "division", value: selectedDivision.name },
      });
    }
    if (selectedDistrict) {
      if (selectedDistrict.name) {
        handleChange({
          target: { name: "district", value: selectedDistrict.name },
        });
      } else {
        handleChange({
          target: { name: "district", value: selectedDistrict },
        });
      }
    }
    if (selectedUpazila) {
      handleChange({
        target: { name: "upazilla", value: selectedUpazila.name },
      });
    }
    if (selectedArea) {
      console.log("selectedArea================================", selectedArea);
      handleChange({
        target: { name: "areaRef", value: selectedArea },
      });
    }
    if (selectedThana) {
      console.log(
        "selectedThana================================",
        selectedThana
      );
      handleChange({
        target: { name: "thanaRef", value: selectedThana },
      });
    }
  }, [
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedArea,
    selectedThana,
  ]);

  // State to track if the placeholder option should be disabled
  const [isPlaceholderDisabled, setIsPlaceholderDisabled] = useState({
    district: false,
    thana: false,
    area: false,
  });

  // Fetch districts on component mount
  useEffect(() => {
    getDistrict();
  }, []);

  // Fetch thanas when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      if (checkoutType === "service") {
        getThana();
      } else {
        getUpazila(); // Fetch Upazilas for non-service checkout
      }
    }
  }, [selectedDistrict]);

  // Fetch areas when a thana is selected
  useEffect(() => {
    if (selectedThana) {
      getArea();
    }
  }, [selectedThana]);

  // Function to fetch districts
  // division: "",
  //   district: "",
  //   upazilla: "",
  //   area: "",
  const getDistrict = async () => {
    try {
      let response;
      if (checkoutType === "service") {
        response = await api.get(`/districts`);
        setDistrictList(response.data.data.doc);
      }

      console.log("This is response", response);
      console.log("THis is distict List", districtList);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistrictList([]);
    }
  };

  // Function to fetch all thanas
  const getThana = async () => {
    try {
      const response = await api.get(`/thanas`);
      setThanaList(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching thanas:", error);
    }
  };

  const getUpazila = async () => {
    try {
      const response = await axios.get(
        `https://bdapis.com/api/v1.2/district/${selectedDistrict}`
      );
      setUpazilaList(response?.data?.data[0]?.upazillas);
    } catch (error) {
      console.error("Error fetching Upazilas:", error);
      setUpazilaList([]);
    }
  };

  console.log(upazilaList);

  // Function to fetch all areas
  const getArea = async () => {
    try {
      const response = await api.get(`/areas`);
      setAreaList(response.data.data.doc);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  // Filter thanas based on the selected district
  const getFilteredThanas = () => {
    if (!selectedDistrict) return [];
    return thanaList.filter(
      (thana) => thana.districtRef._id === selectedDistrict
    );
  };

  // Filter areas based on the selected thana
  const getFilteredAreas = () => {
    if (!selectedThana) return [];
    return areaList.filter((area) => area?.thanaRef._id === selectedThana);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedThana("");
    setSelectedArea("");
    handleChange({ target: { name: "districtRef", value: districtId } });
  };

  const handleThanaChange = (e) => {
    const thanaId = e.target.value;
    setSelectedThana(thanaId);
    setSelectedArea("");
    handleChange({ target: { name: "thanaRef", value: thanaId } });
  };

  // Handle area change
  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);
    handleChange({ target: { name: "areaRef", value: areaId } });
  };

  const handleUpazilaChange = (e) => {
    const upazilaId = e.target.value;
    setSelectedUpazila(upazilaId);
    handleChange({ target: { name: "upazilaRef", value: upazilaId } });
  };

  // Handle dropdown click to disable placeholder option
  const handleDropdownClick = (field) => {
    setIsPlaceholderDisabled((prev) => ({ ...prev, [field]: true }));
  };

  console.log(selectedArea, selectedDistrict, selectedThana);

  return (
    <form className="w-full mx-auto p-4">
      <h2 className="text-xl text-center font-medium mb-2 text-gray-500 tracking-widest">
        {checkoutType === "product" ? "Billing Details" : "Service Details"}
      </h2>
      <div className="border mb-4"></div>

      {/* Billing Details Fields */}
      <div className="flex flex-col lg:flex-row gap-x-4">
        <div className="w-full mb-4 relative">
          <label className="block text-gray-700 mb-2 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={billingDetails.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="First name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4 w-full relative">
          <label className="block text-gray-700 mb-2 text-sm">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={billingDetails.phone}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Phone"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone}</span>
          )}
        </div>

        <div className="mb-4 w-full relative">
          <label className="block text-gray-700 mb-2 text-sm">
            Email Address{" "}
            <span className="text-gray-400 ml-1 text-xs">(optional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={billingDetails.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
            placeholder="Email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Division, District, Upazila, Thana, and Area in one line with nested dropdowns */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {checkoutType !== "service" && (
          <div className="flex-1">
            <DivisionSelect
              placeholder="Select Division"
              value={selectedDivision}
              onChange={setSelectedDivision}
              customLabel={
                <>
                  Division <span className="text-red-500">*</span>
                </>
              }
              showLabels={true}
            />
          </div>
        )}

        {checkoutType === "service" ? (
          <>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="districtRef"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                onClick={() => handleDropdownClick("district")}
                className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
              >
                <option value="" disabled={isPlaceholderDisabled.district}>
                  Select District
                </option>
                {districtList.map((district, index) => (
                  <option key={index} value={district._id}>
                    {checkoutType === "service"
                      ? district?.name
                      : district?.district}
                  </option>
                ))}
              </select>
              {/* <DistrictSelect
            onChange={handleDistrictChange}
            placeholder="Select District"
            customLabel="District"
            showLabels={true}
          /> */}
              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district}</p>
              )}
            </div>{" "}
          </>
        ) : (
          <div className="flex-1">
            <DistrictSelect
              division={selectedDivision || null}
              onChange={setSelectedDistrict}
              value={selectedDistrict}
              placeholder="Select District"
              customLabel={
                <>
                  District <span className="text-red-500">*</span>
                </>
              }
              showLabels={true}
            />
          </div>
        )}

        {checkoutType === "service" ? (
          <>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Thana <span className="text-red-500">*</span>
              </label>
              <select
                name="thanaRef"
                value={selectedThana}
                onChange={handleThanaChange}
                onClick={() => handleDropdownClick("thana")}
                className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
                disabled={!selectedDistrict}
              >
                <option value="" disabled={isPlaceholderDisabled.thana}>
                  Select Thana
                </option>
                {getFilteredThanas().map((thana, index) => (
                  <option key={index} value={thana._id}>
                    {thana.name}
                  </option>
                ))}
              </select>
              {errors.thana && (
                <p className="text-red-500 text-sm">{errors.thana}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Area <span className="text-red-500">*</span>
              </label>
              <select
                name="areaRef"
                value={selectedArea}
                onChange={handleAreaChange}
                onClick={() => handleDropdownClick("area")}
                className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
                disabled={!selectedThana}
              >
                <option value="" disabled={isPlaceholderDisabled.area}>
                  Select Area
                </option>
                {getFilteredAreas().map((area, index) => (
                  <option key={index} value={area?._id}>
                    {area?.name}
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="text-red-500 text-sm">{errors.area}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* <div className="flex-1">
              <label className="block text-gray-700 mb-2 text-sm">
                Upazila <span className="text-red-500">*</span>
              </label>
              <select
                name="areaRef"
                value={selectedUpazila}
                onChange={handleUpazilaChange}
                onClick={() => handleDropdownClick("upazila")}
                className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
                disabled={!selectedDistrict}
              >
                <option value="" disabled={isPlaceholderDisabled.area}>
                  Select Upazila
                </option>
                {upazilaList.map((upazila, index) => (
                  <option key={index} value={upazila?._id}>
                    {upazila}
                  </option>
                ))}
              </select>
              {errors?.area && (
                <p className="text-red-500 text-sm">{errors?.area}</p>
              )}
            </div> */}
            <div className="flex-1">
              <UpazilaSelect
                district={selectedDistrict || null}
                onChange={setSelectedUpazila}
                value={selectedUpazila}
                placeholder="Select Upazila"
                customLabel={
                  <>
                    District <span className="text-red-500">*</span>
                  </>
                }
                className="custom-select-class"
              />
            </div>
          </>
        )}
      </div>

      {/* Street Address */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm">
          Street Address
        </label>
        <input
          type="text"
          name="streetAddress"
          value={billingDetails.streetAddress}
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-100 outline-none text-sm"
          placeholder="House number and street name"
        />
        {errors.streetAddress && (
          <p className="text-red-500 text-sm">{errors.streetAddress}</p>
        )}
      </div>

      {/* Delivery Charge (for product checkout) */}
      {checkoutType === "product" && (
        <div className="my-4">
          <div className="text-xl font-bold my-5">Delivery Charge</div>
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-sm rounded-lg border transition-all duration-300 ease-in-out ${
                selectedLocation === "insideDhaka"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-green-500 hover:text-white"
              }`}
              onClick={() => handleLocationChange("insideDhaka")}
            >
              Inside Dhaka - 70 taka
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-sm rounded-lg border transition-all duration-300 ease-in-out ${
                selectedLocation === "outsideDhaka"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-green-500 hover:text-white"
              }`}
              onClick={() => handleLocationChange("outsideDhaka")}
            >
              Outside Dhaka - 120 taka
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-2 text-sm rounded-lg border transition-all duration-300 ease-in-out ${
                selectedLocation === "inShop"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-green-500 hover:text-white"
              }`}
              onClick={() => handleLocationChange("inShop")}
            >
              In Shop - 0 taka (Purchasing from shop)
            </button>
          </div>
          {errors.selectedLocation && (
            <p className="text-red-500 text-sm mt-2">
              {errors.selectedLocation}
            </p>
          )}
        </div>
      )}

      {checkoutType === "service" && (
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Date Picker */}
          <div className="flex-1">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <FaCalendarAlt className="inline-block mr-2" />
              Date
            </label>
            <DatePicker
              onChange={handleDateChange}
              format="DD-MM-YYYY"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Time Range Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaClock className="inline-block mr-2" />
              Time Range
            </label>
            <TimePicker.RangePicker
              format="hh:mm A"
              onChange={handleTimeRangeChange}
              use12Hours
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Order Notes */}
      <div className="mb-2">
        <label className="block text-gray-700 mb-2 text-sm">
          Order notes{" "}
          <span className="text-gray-400 ml-1 text-xs">(optional)</span>
        </label>
        <textarea
          name="notes"
          value={billingDetails.notes}
          onChange={handleChange}
          className="w-full h-32 p-3 rounded bg-slate-100 outline-none text-sm"
          placeholder="Notes about your order..."
        />
      </div>

      {/* <LocationSelector></LocationSelector> */}
    </form>
  );
};

export default BillingDetails;
