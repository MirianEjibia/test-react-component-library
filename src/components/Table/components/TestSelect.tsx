import React from 'react';

import Select from 'react-select';

 interface TestSelectPropsType {
 options: {value: String, label: String  }[]
 onChange?: any
}

export default function TestSelect (props: TestSelectPropsType)  {
  return <Select
    isMulti
    // defaultValue={props.options}
    value={props.options}
    options={props.options}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange={props.onChange}
  />
};