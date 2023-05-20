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
import { RefObject } from "react";
import { LegacyRef } from "react";

interface showFilterColumnType {
  date_created: boolean;
  email: boolean;
  first_name: boolean;
  gender: boolean;
  id: boolean;
  last_name: boolean;
  locked: boolean;
  select: boolean;
}

interface DropdownProps {
  column: Column<any>;
  table: Table<any>;
  showFilterColumn: showFilterColumnType;
  setShowFilterColumn: ({}) => void;
}

export function Dropdown({
  table,
  column,
  showFilterColumn,
  setShowFilterColumn,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLElement>(null);

  //   useEffect(() => console.log("mount"), []);
  useEffect(() => {
    if (showFilterColumn[column.id as keyof showFilterColumnType]) {
      let handler = (e: Event) => {
        if (!dropdownRef.current!.contains(e.target as Node)) {
          setShowFilterColumn({});
        }
      };
      document.addEventListener("mousedown", handler);

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  });

  console.log("showFilterColumn", showFilterColumn);
  const getAllColumnIds = () => table.getAllColumns().map((c) => c.id);

  const showColumnFilterDropdown = (colId: string | undefined) => {
    let showColumnsObj = {};
    getAllColumnIds().map((ci) => ((showColumnsObj as any)[ci] = ci === colId));
    setShowFilterColumn(showColumnsObj);
    console.log("showColumnsObj");
  };
  const sortingState: { id: string; desc: boolean }[] =
    table.getState()?.sorting;
  const columnSortiongState = sortingState?.find(
    (s) => s.id && s.id === column.id
  );
  const getIsDescending = () => columnSortiongState?.desc;

  const updateSortingState = (desc: boolean) => {
    let stateCopy = [...sortingState];
    let columnState = stateCopy?.find((s) => s.id && s.id === column.id);
    columnState
      ? (columnState.desc = desc)
      : stateCopy.push({ id: column.id, desc: desc });
    table.setSorting(stateCopy);
  };
  
  return column.getCanFilter() ? (
    <div
      className="dropdown"
      ref={dropdownRef as LegacyRef<HTMLDivElement> | undefined}
      key={column.id}
    >
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
          className={`dropdown-item text-style pl-1 ${
            column.getIsSorted() ? "" : "disabled"
          }`}
          onClick={column.clearSorting}
        >
          <MdOutlineClearAll className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">Cleare Sort </span>
        </a>
        <a
          className={`dropdown-item text-style ${
            (getIsDescending() === true || getIsDescending() === undefined) &&
            showFilterColumn[column.id as keyof showFilterColumnType]
              ? ""
              : "disabled"
          }`}
          onClick={() => updateSortingState(false)}
        >
          <BiSortUp className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">
            Sort by {column.id} ascending
          </span>
        </a>
        <a
          className={`dropdown-item text-style border_bottom ${
            (getIsDescending() === false || getIsDescending() === undefined) &&
            showFilterColumn[column.id as keyof showFilterColumnType]
              ? ""
              : "disabled"
          }`}
          onClick={() => updateSortingState(true)}
        >
          <BiSortDown className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">
            Sort by {column.id} descending
          </span>
        </a>
        <a className="dropdown-item text-style">
          <VscClearAll className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label">Cleare filter</span>
        </a>
        <a className="dropdown-item text-style border_bottom">
          <BiFilter className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Filter by {column.id}</span>
        </a>
        <a className="dropdown-item text-style">
          <BiHide className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Hide Column{column.id}</span>
        </a>
        <a className="dropdown-item text-style">
          <BiColumns className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Show all columns</span>
        </a>
      </div>
    </div>
  ) : null;
}
