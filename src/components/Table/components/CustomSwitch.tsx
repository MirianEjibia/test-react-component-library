import React from "react";

interface CustomSwitchProps {
  checked: boolean;
  // size: number
}
export function CustomSwitch({ checked }: CustomSwitchProps) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckChecked"
        checked={checked}
      />
      <label className="form-check-label" for="flexSwitchCheckChecked">
        {/* Checked switch checkbox input */}
      </label>
    </div>
  );
}
