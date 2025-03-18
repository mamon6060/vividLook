/* eslint-disable react/prop-types */
// import React from 'react'

const Containar = ({ children, className }) => {
  return (
    <div className={`xl:container lg:container px-8 mx-auto ${className} px-2`}>
      {children}
    </div>
  );
};

export default Containar;
