import { useState, useMemo } from "react";
import CheckoutAccordion from "./CheckoutAccordion";
import { TbCurrencyTaka } from "react-icons/tb";
import { useSelector } from "react-redux";
import bkashLogo from "../../assets/bkashLogo.webp";

const OrderDetails = ({
  checkoutType,
  isAgree,
  setIsAgree,
  selectedLocation,
  handleLocationChange,
  deliveryCharge,
  openIndex,
  handleToggle,
  errors,
}) => {
  // State for payment method and bKash details
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Fetch cart data based on checkout type
  let cartProduct =
    checkoutType === "product"
      ? useSelector((state) => state.agroCart)
      : useSelector((state) => state.serviceCart);

  console.log("This is cart product", cartProduct);
  console.log(checkoutType);

  const cartAuth = useSelector((state) => state.auth);

  // Filter cart products based on user authentication
  if (cartAuth?.user) {
    cartProduct = cartProduct.filter(
      (item) => item.userId === cartAuth.user._id
    );
  } else {
    cartProduct = cartProduct.filter((item) => item.userId === null);
  }

  // Calculate subtotal using useMemo
  const subtotal = useMemo(() => {
    return cartProduct.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }, [cartProduct]);

  // Calculate total including delivery charge
  const total = subtotal + deliveryCharge;

  // Helper function to format currency
  const formatCurrency = (amount) => (
    <>
      <TbCurrencyTaka className="inline font-bold text-lg m-0 p-0" />
      {amount}
    </>
  );

  return (
    <div className="w-full mx-auto px-4 py-4 border border-black rounded-xl top-0">
      <h2 className="text-base text-center font-medium mb-2 text-gray-600">
        {checkoutType === "product" ? "Your Order" : "Your Services"}
      </h2>
      <div className="border mb-6"></div>
      <div className="mb-4">
        <div className="flex justify-between font-bold text-gray-600 mb-2">
          <span>Product</span>
          <span>Amount</span>
        </div>
        <div className="border border-b-0 mb-5"></div>
        {cartProduct.map((product, index) => (
          <div key={product._id} className="mb-3">
            <div className="flex justify-between mb-4 text-[15px] md:text-base">
              <span>
                {checkoutType === "product" ? product?.title : product?.heading}{" "}
                x <span className="font-bold">{product.quantity}</span>
              </span>
              <span>{formatCurrency(product.price * product.quantity)}</span>
            </div>
            {index < cartProduct.length - 1 && (
              <div className="border border-b-0 mb-2"></div>
            )}
          </div>
        ))}
        {cartProduct.map((item) => {
          <div>{item.heading}</div>;
        })}
        {checkoutType === "product" && (
          <>
            <div className="flex justify-between font-bold mb-10">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="border border-b-0 mb-2"></div>

            <div className="flex justify-between font-bold mb-10">
              <span>Delivery Charge</span>
              <span>{formatCurrency(deliveryCharge)}</span>
            </div>
          </>
        )}
      </div>
      <div className="border border-b-0 mb-3"></div>
      <div className="flex justify-between font-bold mb-4">
        <span className="text-lg">Total</span>
        <span className="text-xl text-gray-900">{formatCurrency(total)}</span>
      </div>

      {/* Payment options */}
      {checkoutType === "product" && (
        <div className="mb-4 mt-8">
          <h3 className="text-lg font-bold mb-2">Payment Methods</h3>
          <div className="border border-b-0 mb-4"></div>
          {/* <CheckoutAccordion
            title="Online Payment"
            content="Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account."
            isOpen={openIndex === 0}
            isSelected={openIndex === 0}
            onToggle={() => handleToggle(0)}
            name="accordion"
          />
          {openIndex === 0 && (
            <div className="p-4 mb-4 border border-gray-300 rounded-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSelectedPaymentMethod("bkash")}
              >
                <div className="flex items-center">
                  <label className="font-medium">Bkash</label>
                </div>
                <div className="h-10 w-10">
                  <img
                    src={bkashLogo}
                    className="h-full w-full"
                    alt="bKash Logo"
                  />
                </div>
              </div>
            </div>
          )} */}

          <CheckoutAccordion
            title="Cash on delivery"
            content="Pay with cash upon delivery."
            isOpen={openIndex === 2}
            isSelected={openIndex === 2}
            onToggle={() => handleToggle(2)}
            name="accordion"
          />
          {errors.selectedPaymentMethod && (
            <p className="text-red-500 text-sm">
              {errors.selectedPaymentMethod}
            </p>
          )}
        </div>
      )}

      <div className="mb-6 text-sm">
        <p>
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our{" "}
          <span className="text-rose-600 hover:underline cursor-pointer">
            privacy policy.
          </span>
        </p>
      </div>
      <div className="mb-4 text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAgree}
            onChange={() => setIsAgree(!isAgree)}
            className="mr-2"
          />
          <span>
            I have read and agree to the website{" "}
            <span className="text-rose-600 hover:underline cursor-pointer">
              terms and conditions
            </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default OrderDetails;
