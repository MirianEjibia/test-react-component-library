import { Column, Table } from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import { FcClearFilters } from "react-icons/fc";
import { VscClearAll } from "react-icons/vsc";
import { MdOutlineClearAll } from "react-icons/md";
import { BsFilter } from "react-icons/bs";
import { HiViewColumns, HiOutlineViewColumns } from "react-icons/hi2";
import { CustomSwitch } from "./CustomSwitch";

interface DropdownProps {
  // column: Column<any>;
  table: Table<any>;
  showFilterColumn: {};
  setShowFilterColumn: ({}) => void;
}

export function ColumnVisibilityControlDropdown({
  table,
  // column,
  showFilterColumn,
  setShowFilterColumn,
}: DropdownProps) {
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    // if (showFilterColumn[column.id]) {
    let handler = (e: Event) => {
      if (!dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    // };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const getAllColumnIds = () => table.getAllColumns().map((c) => c.id);

  const showColumnFilterDropdown = (colId: string | undefined) => {
    let showColumnsObj = {};
    getAllColumnIds().map((ci) => ((showColumnsObj as any)[ci] = ci === colId));
    setShowFilterColumn(showColumnsObj);
    console.log("showColumnsObj", showColumnsObj);
  };

  return (
    <div className="dropdown d-flex" ref={dropdownRef}>
      <button
        className="filter-btn"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span className="table-options-icons-wrapper">
          {table.getIsAllColumnsVisible() ? (
            <HiViewColumns />
          ) : (
            <HiOutlineViewColumns />
          )}
        </span>
      </button>
      <div
        className={`dropdown-menu d-contents dropdown-menu-column-visibility  ${
          showDropdown ? "show" : ""
        }`}
        aria-labelledby="dropdownMenuButton"
      >
        <div className="d-flex">
          <a
            className={`dropdown-item text-style pl-1 d-flex h6`}
            onClick={() => table.toggleAllColumnsVisible()}
          >
            <CustomSwitch checked={table.getIsAllColumnsVisible()} />
            <span className="filter-dropdown-label">
              {" "}
              <strong>
                {table.getIsAllColumnsVisible() ? "Hide" : "Show"} all columns{" "}
              </strong>{" "}
            </span>
          </a>
        </div>
        {table.getAllColumns().map((col, i) => {
          return (
            <a
              className={`dropdown-item text-style pl-1 d-flex h6 ${
                i === 0 && "border-top"
              } `}
              onClick={() => col.toggleVisibility()}
            >
              <CustomSwitch checked={col.getIsVisible()} />
              <span className="filter-dropdown-label">{col.id} </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
