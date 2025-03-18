import Containar from "../components/containar/Containar";
import thankyoulogo from "../assets/thank-you/thank-you_logo.jpg";

const Thankyou = () => {
  return (
    <div className="font-robo">
  
      <Containar>
        <div className="flex flex-col items-center justify-center min-h-scree my-16">
          <div className="bg-white p-6 rounded-lg  text-center flex flex-col items-center">
            <h1 className="text-5xl text-primary font-bold mb-6 tracking-tight	">
              Madina Refrigeration
            </h1>
            <h2 className="text-2xl font-bold">Thank you for your purchase</h2>
            {/* <p className="text-gray-700 mt-2">ORDER NO. 1265</p> */}
            <img src={thankyoulogo} className="w-60 h-60 mt-10"></img>
            <p className="text-gray-700 mb-4">
              We will send you another email when it is in Transit
            </p>
            {/* <button className="border-2 border-primary text-primary px-4 py-2 rounded">
              TRACK YOUR ORDER HERE
            </button> */}
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default Thankyou;
