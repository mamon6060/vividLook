// import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import CheckoutAccordion from "./CheckoutAccordion";
import { useState } from "react";

const OrderDetails = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const [isAgree, setIsAgree] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // toggle between open and close
  };
  return (
    <div className="w-full mx-auto px-4 py-12 border border-black rounded-xl sticky top-0">
      <h2 className="text-base font-medium mb-2 text-gray-600">Your Order</h2>
      <div className="border mb-6"></div>
      <div className="mb-4">
        <div className="flex justify-between font-bold text-gray-600 mb-2">
          <span className=""> Product</span>
          <span>Subtitle </span>
        </div>
        <div className="border border-b-0 mb-5"></div>
        <div className="flex justify-between mb-4">
          <span>
            Growth Booster x <span className="font-bold">2</span>
          </span>
          <span>
            <TbCurrencyTaka className="inline font-bold text-lg m-0 p-0" />
            1450
          </span>
        </div>
        {/* map function this div */}
        <div className="flex justify-between mb-3">
          <span>
            Fish Booster x <span className="font-bold">2</span>
          </span>
          <span>
            <TbCurrencyTaka className="inline font-bold text-lg m-0 p-0" />
            1000
          </span>
        </div>

        <div className="border border-b-0 mb-2"></div>
        <div className="flex justify-between font-bold mb-10">
          <span>Subtotal</span>
          <span>
            <TbCurrencyTaka className="inline font-bold text-lg m-0 p-0" />
            2450
          </span>
        </div>
      </div>

      <div className="border border-b-0 mb-3"></div>

      <div className="flex justify-between font-bold mb-4 ">
        <span className="text-lg">Total</span>
        <span className="text-xl text-gray-900">
          <TbCurrencyTaka className="inline  font-extrabold text-xl m-0 p-0" />
          2500
        </span>
      </div>
      {/* <div className="border border-b-0 mt-3 mb-5"></div> */}

      <div className="mb-4 mt-8">
        <h3 className="text-lg font-bold mb-2">Payment Methods</h3>
        <div className="border border-b-0 mb-4"></div>

        <CheckoutAccordion
          title="Direct bank transfer"
          content="Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account."
          isOpen={openIndex === 0}
          isSelected={openIndex === 0}
          onToggle={() => handleToggle(0)}
          name="accordion"
        />
        <CheckoutAccordion
          title="Check payments"
          content="Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode."
          isOpen={openIndex === 1}
          isSelected={openIndex === 1}
          onToggle={() => handleToggle(1)}
          name="accordion"
        />
        <CheckoutAccordion
          title="Cash on delivery"
          content="Pay with cash upon delivery."
          isOpen={openIndex === 2}
          isSelected={openIndex === 2}
          onToggle={() => handleToggle(2)}
          name="accordion"
        />
      </div>
      <div className="mb-6 text-sm">
        <p>
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our.
          <span className="text-rose-600 hover:underline cursor-pointer">
            privacy policy.
          </span>
        </p>
      </div>
      <div className="mb-4 text-sm">
        <input
          type="checkbox"
          onClick={() => setIsAgree(!isAgree)}
          className="mr-2"
        />
        <span>
          I have read and agree to the website{" "}
          <span className="text-rose-600 hover:underline cursor-pointer">
            terms and conditions
          </span>
        </span>
      </div>
      <button
        className={`${
          isAgree ? "bg-red-500 text-white" : " bg-gray-300 text-gray-800"
        } w-full   p-2 rounded mt-3`}
        disabled={!isAgree}
      >
        Place order
      </button>
    </div>
  );
};

export default OrderDetails;
