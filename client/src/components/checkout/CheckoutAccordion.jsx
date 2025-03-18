/* eslint-disable react/prop-types */

const CheckoutAccordion = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className=" border-gray-300">
      <div className={`${isOpen ? "mb-0" : "mb-2 "} flex items-center `}>
        <h2
          className={`${
            isOpen
              ? "bg-primary text-white w-full p-2"
              : "bg-gray-300 text-black w-full p-2"
          } text-md font-semibold cursor-pointer `}
          onClick={onToggle}
        >
          {title}
        </h2>
      </div>
      {isOpen && (
        <div className="text-xs mb-2 text-gray-700">
          <p className="border border-primary p-1">{content}</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutAccordion;
