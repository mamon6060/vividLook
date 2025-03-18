import Containar from "../components/containar/Containar";
import { TbCurrencyTaka } from "react-icons/tb";

const OrderConfirmation = () => {
  const order = {
    number: "5197",
    date: "October 3, 2024",
    total: "1779",
    paymentMethod: "Cash on delivery",
    items: [
      {
        name: "All Natural Italian-Style Chicken Meatballs",
        quantity: 2,
        price: "1450",
      },
      {
        name: "Angie's Boomchickapop Sweet & Salty Kettle Corn",
        quantity: 1,
        price: "329",
      },
    ],
    shippingAddress: "Bandarban, Bangladesh",
    billingAddress: "Bandarban, Bangladesh",
    phone: "0192741926475",
    email: "Bandarban, Bangladesh",
    road: "tushar road 2/3",
  };

  return (
    <div className="font-robo mb-20">
      <Containar>
        <div className=" mx-auto p-4">
          <div className="border-dashed border-2 border-primary p-4 mb-4">
            <h2 className="text-2xl font-bold py-4 text-center text-primary">
              Thank you. Your order has been received.
            </h2>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-1 py-6 shadow justify-between px-4 text-gray-600 my-12">
            <p>
              Order number :
              <span className="block font-bold"> {order.number}</span>
            </p>
            <p>
              Date: <span className="block font-bold">{order.date}</span>
            </p>
            <p>
              Total:{" "}
              <span className="block font-bold">
                <TbCurrencyTaka className="inline font-bold" />
                {order.total}
              </span>
            </p>
            <p>
              Payment method:{" "}
              <span className="block font-bold">{order.paymentMethod}</span>{" "}
            </p>
          </div>
          <div className="my-5">
            <span>Pay with cash upon delivery.</span>
          </div>
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <table className="w-full text-left border">
              <thead className="border">
                <tr className="border p-3">
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">{item.quantity}</td>
                    <td className="p-3 border">
                      <TbCurrencyTaka className="inline font-bold" />
                      {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody className="text-gray-700">
                <tr className="border">
                  <td className="p-3 border font-bold">Total</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    1779
                  </td>
                </tr>
                <tr className="border">
                  <td className="p-3 border font-bold">Subtotal:</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    1779
                  </td>
                </tr>
                <tr className="border">
                  <td className="p-3 border font-bold">Shipping :</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    50
                  </td>
                </tr>
                <tr className="border">
                  <td className="p-3 border font-bold">Payment method :</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    50
                  </td>
                </tr>
                <tr className="border">
                  <td className="p-3 border font-bold">Total</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    50
                  </td>
                </tr>
                <tr className="border">
                  <td className="p-3 border font-bold">Note :</td>
                  <td className="p-3 border"></td>
                  <td className="p-3 border">
                    <TbCurrencyTaka className="inline font-bold" />
                    50
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-gray-600">
            <h3 className="text-xl font-semibold text-black mb-3">
              Shipping Address
            </h3>
            <p className="text-sm mb-1">{order.shippingAddress}</p>
            <p className="text-sm  mb-1">{order.phone}</p>
            <p className="text-sm  mb-1">{order.email}</p>
            <p className="text-sm">{order.road}</p>
          </div>
          {/* <div className="mt-4">
            <h3 className="text-xl font-semibold">Billing Address</h3>
            <p>{order.billingAddress}</p>
          </div> */}
        </div>
      </Containar>
    </div>
  );
};

export default OrderConfirmation;
