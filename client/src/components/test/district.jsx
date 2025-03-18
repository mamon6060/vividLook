import {
    DivisionSelect,  
    DistrictSelect,
    UpazilaSelect,
    UnionSelect
  } from 'bd-geo-info';
  import { useState } from 'react';
  
  const LocationSelector = () => {
    const [division, setDivision] = useState(null);
    const [district, setDistrict] = useState(null);
    const [upazila, setUpazila] = useState(null);
  
    return (
      <div>
        {/* Division Select */}
        <DivisionSelect
          language="en"
          onChange={setDivision}
          placeholder="Select Division"
          customLabel="Division"
        />
  
        {/* District Select - Shows all districts if no division is selected */}
        <DistrictSelect
          division={division || null} // If no division, show all districts
          onChange={setDistrict}
          placeholder="Select District"
          customLabel="District"
          showLabels={true}
        />
  
        {/* Upazila Select */}
        <UpazilaSelect
          district={district}
          onChange={setUpazila}
          placeholder="Select Upazila"
          className="custom-select-class"
        />
  
        {/* Union Select */}
        <UnionSelect
          upazila={upazila}
          onChange={(union) => console.log(union)}
          language="bn"
          showLabels={true}
        />
      </div>
    );
  };
  
  export default LocationSelector;