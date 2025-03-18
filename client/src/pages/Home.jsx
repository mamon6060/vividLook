import { useState } from "react";
import Partner from "../components/home/Partner";
import Product from "../components/home/Product";
import Banner from "../components/home/Banner";

import Service from "../components/home/Service";
import HomeProducts from "../components/home/HomeProducts";

const Home = () => {
  const [showComponents, setShowComponents] = useState(true);

  return (
    <>
      <div className="font-robo">
        <Banner />

        <HomeProducts></HomeProducts>

        <Product />
        <Service />
        <Partner />
      </div>
    </>
  );
};

export default Home;
