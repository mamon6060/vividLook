import Containar from "../containar/Containar";
import Leaf1 from "../../assets/About/Leaf-1.svg";

const topics = [
  {
    id: 1,
    title: "Reliable Repairs",
    description:
      "We provide expert repair services for ACs, fridges, and cooling appliances, ensuring long-lasting performance and efficiency. Our experienced technicians diagnose issues accurately and implement precise solutions to restore your appliances to peak condition, minimizing downtime and preventing future breakdowns.",
  },
  {
    id: 2,
    title: "High-Quality Components",
    description:
      "Our replacement parts are sourced from trusted manufacturers to guarantee durability and seamless compatibility with your appliances. We use only premium components to enhance performance and extend the lifespan of your refrigeration units, ensuring optimal cooling efficiency and reliability.",
  },
  {
    id: 3,
    title: "Energy Efficiency",
    description:
      "Our services and components help improve energy efficiency, reducing electricity costs while maintaining optimal cooling performance. By optimizing refrigerant levels, cleaning essential parts, and using energy-efficient components, we ensure your appliances run smoothly with minimal energy consumption.",
  },
  {
    id: 4,
    title: "Customer Satisfaction",
    description:
      "We prioritize our customers by offering timely, professional service and ensuring all repairs and installations meet high-quality standards. Our customer-centric approach includes clear communication, fair pricing, and personalized solutions, guaranteeing a hassle-free experience and complete peace of mind.",
  },
  {
    id: 5,
    title: "Sustainable Solutions",
    description:
      "We promote eco-friendly refrigeration solutions, reducing environmental impact through responsible servicing and maintenance practices. Our approach includes proper disposal of old refrigerants, usage of eco-friendly coolants, and preventive maintenance to extend appliance life, minimizing waste and promoting sustainability.",
  },
];

const ChooseUs = () => {
  return (
    <div className="py-12 bg-gray-50">
      <Containar>
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="text-center md:text-left">
            <h4 className="text-md font-bold text-[#269E4B] uppercase mb-3 tracking-wider">
              Why Our Clients Trust Us
            </h4>
            <h1 className="md:text-4xl text-2xl font-semibold text-gray-900 leading-tight">
              Why Choose Madina Refrigeration?
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-4">
          {topics.map((topic, index) => (
            <div key={topic.id} className="mt-16 group">
              <p className="text-lg font-medium flex items-center text-gray-700 group">
                <span className="text-2xl font-bold text-[#269E4B]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 h-px mx-4 relative overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-0 bg-[#269E4B] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </div>
              </p>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-transparent group-hover:border-[#269E4B]">
                <h2 className="md:text-3xl text-xl font-medium text-gray-900 w-full md:w-1/2 group-hover:text-[#269E4B] transition-colors">
                  {topic.title}
                </h2>
                <p className="text-gray-600 w-full md:w-1/2 text-lg leading-relaxed">
                  {topic.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Containar>
    </div>
  );
};

export default ChooseUs;
