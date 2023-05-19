import React from "react";
import Modal from "react-bootstrap/Modal";

const FilterModalContent = (props: any) => {
  return (
    <ul>
      <li>
        <i></i>
        <div> Cleare Sort </div>
      </li>
      <li>
        <i></i>
        <div> Sort by 'Col name' ascending </div>
      </li>
      <li>
        <i></i>
        <div> Sort by 'Col name' descending </div>
      </li>
      <li>
        <i></i>
        <div>Cleare filter </div>
      </li>
      <li>
        <i></i>
        <div>Filter by 'Col Name' </div>
      </li>
      <li>
        <i></i>
        <div>Show All Columns </div>
      </li>
    </ul>
  );
};

export default FilterModalContent;
