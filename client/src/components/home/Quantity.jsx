import bdImg from "../../assets/bg1.png";
import bdImg2 from "../../assets/bg-2.png";
const Quantity = () => {
  return (
    <div className=" relative mb-24">
      <div
        className=" absolute top-100 rounded-lg w-[956px] mx-auto h-[261px] -mb-[350px] bg-no-repeat "
        style={{ backgroundImage: `url(${bdImg2})` }}
      ></div>
      <div
        className="flex justify-between items-start w-[1280px] mx-10 rounded-md -mt-9  h-[540px]"
        style={{ backgroundImage: `url(${bdImg})` }}
      >
        <div className="text-white p-12 ps-24 ">
          <p className="text-3xl">
            We are proud of<br></br> our <strong>Numbers</strong>
          </p>
        </div>
        {/* <div className="w-80 h-20 bg-red-500 rotate-12 px-10 mt-20"></div> */}
        <div className="p-12 py-8 rounded-xl text-white grid grid-cols-3 items-center gap-10 mt-60">
          <div className="text-center">
            <p className="font-semibold text-3xl">10000 +</p>
            <small className="text-2xl font-light">Satisfied customer</small>
          </div>
          <div className="text-center">
            <p className="font-semibold text-3xl"> 8</p>
            <small className="text-2xl font-light">Our Products</small>
          </div>
          <div className="text-center">
            <p className="font-semibold text-3xl">50</p>
            <small className="text-2xl font-light">Our Delarship</small>
          </div>
          <div className="text-center">
            <p className="font-semibold text-3xl">200</p>
            <small className="text-2xl font-light">Our Team Member</small>
          </div>
          <div className="text-center">
            <p className="font-semibold text-3xl">2 </p>
            <small className="text-2xl font-light">Year of Experience</small>
          </div>
          <div className="text-center">
            <p className="font-semibold text-3xl">5</p>
            <small className="text-2xl font-light">Achivements</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quantity;
