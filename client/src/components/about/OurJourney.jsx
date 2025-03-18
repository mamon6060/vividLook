const OurJourney = () => {
  const timelineData = [
    {
      year: "2007",
      title: "Smells Racy Free Announcing",
      description:
        "Vast a real proven works discount secure care. Market invigorate a awesome handcrafted bigger comes.",
    },
    {
      year: "2010",
      title: "Grainfarmers Formed",
      description:
        "Market invigorate a awesome handcrafted bigger comes newer recommended lifetime.",
    },
    {
      year: "2014",
      title: "Group Cereals and Lingrain Merge",
      description:
        "Odor to yummy high racy bonus soaking mouthwatering. First superior full-bodied drink.",
    },
    {
      year: "2017",
      title: "Acquired Countrywide Farmers",
      description:
        "First superior full-bodied drink. Like outstanding odor economical deal clinically.",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-10">The Journey</h2>
      <div className="border w-full p-.5 -mb-2"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {timelineData.map((item, index) => (
          <div key={index} className="relative">
            {/* Line and circle */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gray-300 top-0 z-0"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full top-0"></div>

            {/* Year */}
            <div className="text-center relative z-10 mt-12">
              <h3 className="text-5xl font-bold text-green-700">{item.year}</h3>
              <h4 className="text-lg font-semibold text-green-600 mt-4">
                {item.title}
              </h4>
              <p className="text-gray-500 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurJourney;
