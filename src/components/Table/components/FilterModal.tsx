import React from 'react'
import Modal from "react-bootstrap/Modal";

const FilterModal= (props: any) => {
  return (
    <Modal show={props.show}>
      <Modal.Body>
        {props.children}
      </Modal.Body>
    </Modal>
  );
}

export default FilterModal;
