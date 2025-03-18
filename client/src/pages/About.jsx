// import React from 'react'

import AboutIntroduction from "../components/about/AboutIntroduction";
import AboutValues from "../components/about/AboutValues";
import Chooseus from "../components/about/Chooseus";
import OurJourney from "../components/about/OurJourney";
import OurTeam from "../components/about/OurTeam";
import WhatWeDo from "../components/about/WhatWeDo";
import Partner from "../components/home/Partner";
import BradCumbs from "../components/shared/BradCumbs";

const About = () => {
  return (
    <div className="font-robo lg:px-0">
      <div className="h-[68px] sm:h-[120px] bg-primary "></div>
      <BradCumbs title="Know About Madina " brad="About"></BradCumbs>
      <AboutIntroduction></AboutIntroduction>
      <AboutValues></AboutValues>
      {/* <WhatWeDo></WhatWeDo> */}
      {/* <OurTeam></OurTeam> */}
      {/* <OurJourney></OurJourney> */}
      <Chooseus></Chooseus>
      <Partner></Partner>
    </div>
  );
};

export default About;
