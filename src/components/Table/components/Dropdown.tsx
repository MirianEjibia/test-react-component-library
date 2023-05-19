import { Column, Table } from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import { FcClearFilters } from "react-icons/fc";
import { VscClearAll } from "react-icons/vsc";
import { MdOutlineClearAll } from "react-icons/md";
import { BsFilter } from "react-icons/bs";
import {
  BiSortUp,
  BiSortDown,
  BiColumns,
  BiHide,
  BiFilter,
} from "react-icons/bi";

interface DropdownProps {
  column: Column<any>;
  table: Table<any>;
  showFilterColumn: {};
  setShowFilterColumn: ({}) => void;
}

export function Dropdown({
  table,
  column,
  showFilterColumn,
  setShowFilterColumn,
}: DropdownProps) {
  const dropdownRef = useRef();

  //   useEffect(() => console.log("mount"), []);
  useEffect(() => {
    if (showFilterColumn[column.id]) {
      let handler = (e: Event) => {
        if (!dropdownRef.current.contains(e.target)) {
          setShowFilterColumn({});
        }
      };
      document.addEventListener("mousedown", handler);

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  });

  const getAllColumnIds = () => table.getAllColumns().map((c) => c.id);

  const showColumnFilterDropdown = (colId: string | undefined) => {
    let showColumnsObj = {};
    getAllColumnIds().map((ci) => ((showColumnsObj as any)[ci] = ci === colId));
    setShowFilterColumn(showColumnsObj);
    console.log("showColumnsObj", showColumnsObj);
  };
  return column.getCanFilter() ? (
    <div className="dropdown" ref={dropdownRef} key={column.id}>
      <button
        className="filter-btn"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => showColumnFilterDropdown(column.id)}
      >
        ⋮
      </button>
      <div
        className={`dropdown-menu ${
          (showFilterColumn as any)[column.id] ? "show" : ""
        }`}
        aria-labelledby="dropdownMenuButton"
      >
        <a
          className="dropdown-item text-style pl-1"
        >
          <MdOutlineClearAll className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">Cleare Sort </span>
        </a>
        <a className="dropdown-item text-style" href="#">
          <BiSortUp className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">
            Sort by {column.id} ascending
          </span>
        </a>
        <a className="dropdown-item text-style border_bottom" href="#">
          <BiSortDown className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">
            Sort by {column.id} descending
          </span>
        </a>
        <a className="dropdown-item text-style" href="#">
          <VscClearAll className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">Cleare filter</span>
        </a>
        <a className="dropdown-item text-style border_bottom" href="#">
          <BiFilter className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Filter by {column.id}</span>
        </a>
        <a className="dropdown-item text-style" href="#">
          <BiHide className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Hide Column{column.id}</span>
        </a>
        <a className="dropdown-item text-style" href="#">
          <BiColumns className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Show all columns</span>
        </a>
      </div>
    </div>
  ) : null;
}
