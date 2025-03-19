// import { IoMdMail } from "react-icons/io";
// import { useEffect } from "react";
import contact from "../../assets/Contact/contact_farmer.webp";
import Containar from "../containar/Containar";
import api from "../axios/Axios";
import { toast } from "react-toastify";
const ContractForm = () => {
  const handelContactForm = async (event) => {
    event.preventDefault();
    const formdata = {
      name: event.target.name.value,
      phone: event.target.phone.value,
      email: event.target.email.value,
      subject: event.target.subject.value,
      message: event.target.Comment.value,
    };

    await api
      .post("/contacts", formdata)
      .then(function (response) {
        response && toast("Message sent successful");
        event.target.reset();
      })
      .catch(function (error) {
        toast(error?.response?.data?.message);
      });
    // try {
    //   const response =
    // } catch (error) {
    //   toast(error);
    // }
  };
  return (
    <div className="relative ">
      <div className="lg:-mt-40">
        <Containar>
          <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-6  bg-white shadow rounded-2xl">
            {/* <div className="w-full lg:w-1/2">
              <div className="flex flex-col items-center justify-center rounded-lg ps-4">
                <img src={contact} alt="" />
              </div>
            </div> */}
            {/* ----------------- */}
            <div className="flex flex-col md:flex-row items-center justify-center bg-gray-00 w-full mx-auto ">
              <div className="bg-white p-4 md:p-8 rounded-lg w-full ">
                <h2 className="lg:text-6xl md:text4xl text-3xl font-bold mb-10 text-center">
                  Get in Touch!
                </h2>
                <form onSubmit={handelContactForm} className="w-full">
                  <div className="flex justify-between flex-col md:flex-row  gap-3">
                    <div className="mb-4 w-full">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="w-full px-3 py-3 md:py-5 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4 w-full">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full px-3 py-3 md:py-5 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row  justify-between gap-3">
                    <div className="mb-4  w-full">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-3 md:py-5 border rounded-lg"
                      />
                    </div>
                    <div className="mb-4  w-full">
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        className="w-full px-3 py-3 md:py-5 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <textarea
                      className="w-full px-3 py-3 md:py-5 border rounded-lg"
                      name="Comment"
                      placeholder="Comment"
                      rows="4"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 md:py-5 rounded-lg hover:bg-yellow-600"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default ContractForm;
