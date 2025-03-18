import { useEffect, useState } from "react";
import BillingDetails from "../components/checkout/BillingDetails";
import OrderDetails from "../components/checkout/OrderDetails";
import { useDispatch, useSelector } from "react-redux";
import api from "../components/axios/Axios";
import { Link, useNavigate } from "react-router-dom";
import { resetAgroCart } from "../redux/slices/cart/agroCartSlice";

const CheckOut = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isAgree, setIsAgree] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [selectedLocation, setSelectedLocation] = useState(""); // State for delivery location
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    division: "",
    district: "",
    upazilla: "",
    areaRef: "",
    postCode: "",
    streetAddress: "",
    notes: "",

  });
  const [bankDetails, setBankDetails] = useState({
    bank: "",
    method: "",
    accountName: "",
    accountNumber: "",
    dateOfPayment: "",
    chequeSubmissionDate: "",
    bankReference: "",
    photo: "",
    promo: "",
  });
  const [errors, setErrors] = useState({});
  const [bankErrors, setBankErrors] = useState({});
  const [openIndex, setOpenIndex] = useState(null); // For payment method accordion
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Track selected payment method

  let agroCartProduct = useSelector((state) => state.agroCart);
  let cartAuth = useSelector((state) => state.auth);

  if (cartAuth && cartAuth?.user) {
    agroCartProduct = agroCartProduct.filter(
      (item) => item.userId === cartAuth?.user?._id
    );
  } else {
    agroCartProduct = agroCartProduct.filter((item) => item.userId === null);
  }

  const userData = JSON.parse(localStorage.getItem("user"));

  // Fetch user details and populate billing details
  const userDetailsHandler = async () => {
    try {
      const userDetails = await api.get("/users/getMe", {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      });
      const data = userDetails?.data?.data?.doc;
      setBillingDetails({
        name: data?.name,
        email: data?.email,
        phone: data?.phone?.replace(/^(\+88)/, ""),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userDetailsHandler();
  }, []);

  // Handle accordion toggle for payment methods
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    const paymentMethods = [
      "bank_transfer",
      "check_payment",
      "cash_on_delivery",
    ];
    setSelectedPaymentMethod(paymentMethods[index]);
  };

  // Handle billing details input change
  const handleChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle bank details input change
  const handleChangeBank = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files.length > 0) {
      setBankDetails({
        ...bankDetails,
        [name]: files[0],
      });
    } else {
      setBankDetails({
        ...bankDetails,
        [name]: value,
      });
    }
  };

  // Handle delivery location change
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  // Validate billing details
  const validateForm = () => {
    const newErrors = {};

    if (!billingDetails.name) newErrors.name = "Name is required";
    if (!billingDetails.email) newErrors.email = "Email is required";
    if (!billingDetails.phone) newErrors.phone = "Phone is required";
    if (!billingDetails.district) newErrors.district = "District is required";
    if (!billingDetails.upazilla) newErrors.upazilla = "Upazilla is required";
    if (!billingDetails.area) newErrors.area = "Area is required";
    if (!billingDetails.postCode) newErrors.postCode = "Post Code is required";
    if (!billingDetails.streetAddress)
      newErrors.streetAddress = "Street Address is required";
    if (!selectedLocation)
      newErrors.selectedLocation = "Delivery Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate delivery charge based on selected location
  const calculateDeliveryCharge = () => {
    switch (selectedLocation) {
      case "insideDhaka":
        return 70;
      case "outsideDhaka":
        return 120;
      case "inShop":
        return 0;
      default:
        return 0;
    }
  };

  // Prepare product data for the order
  const prepareProductData = () => {
    return agroCartProduct?.map((product) => ({
      product: product._id,
      productType: product.productType,
      quantity: product.quantity,
    }));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return agroCartProduct.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // if (!validateForm()) return;

    // Calculate delivery charge and total before updating state
    const calculatedDeliveryCharge = calculateDeliveryCharge();
    const subtotal = calculateSubtotal();
    const total = subtotal + calculatedDeliveryCharge;

    // Update the deliveryCharge state (optional, if you need it elsewhere)
    setDeliveryCharge(calculatedDeliveryCharge);

    const orderData = {
      userId: userData?.user?._id,
      name: billingDetails?.name,
      email: billingDetails?.email,
      phone: billingDetails?.phone,
      division: billingDetails?.division,
      district: billingDetails?.district,
      upazilla: billingDetails?.upazilla,
      postCode: billingDetails?.postCode,
      streetAddress: billingDetails?.streetAddress,
      shippingCost: calculatedDeliveryCharge, // Use the calculated delivery charge
      total: total, // Use the calculated total
      notes: billingDetails?.notes,
      products: prepareProductData(),
    };

    try {
      const response = await api.post("orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        dispatch(resetAgroCart());
        navigate("/thank-you");
      } else {
        console.error("Error placing order:", response);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-robo">
     
      <div className="flex flex-col md:flex-row w-full gap-4 text-gray-600 px-2 md:px-20 mt-20">
        <div className="w-full md:w-2/3 border rounded-xl">
          <BillingDetails
            checkoutType={"product"}
            billingDetails={billingDetails}
            handleChange={handleChange}
            errors={errors}
            selectedLocation={selectedLocation}
            handleLocationChange={handleLocationChange}
          />
        </div>
        <div className="w-full md:w-1/3 relative ">
          <div className="sticky top-10">
            <OrderDetails
              checkoutType={"product"}
              isAgree={isAgree}
              setIsAgree={setIsAgree}
              openIndex={openIndex}
              handleToggle={handleToggle}
              bankDetails={bankDetails}
              handleChangeBank={handleChangeBank}
              errors={errors}
              bankErrors={bankErrors}
              selectedLocation={selectedLocation}
              handleLocationChange={handleLocationChange}
              deliveryCharge={calculateDeliveryCharge()}
            />
            <button
              className={`${
                isAgree
                  ? "bg-red-500 text-white block"
                  : "bg-gray-300 text-gray-800 block"
              } w-full p-2 rounded mt-3`}
              disabled={!isAgree}
              onClick={handlePlaceOrder}
            >
              {loading ? "Order Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
      <div className="pl-20 mb-20 flex justify-between">
        <Link to="/shoping-cart">
          <button className="mt-4 px-12 py-2 bg-gray-500 hover:bg-white text-white border hover:text-gray-500 hover:border hover:border-gray-500 rounded-lg font-bold">
            Back To Cart
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CheckOut;
