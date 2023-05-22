import { Column, Table } from "@tanstack/react-table";
import React, { useEffect, useRef } from "react";
import { MdOutlineClearAll, MdOutlineFilterListOff } from "react-icons/md";
import {
  BiSortUp,
  BiSortDown,
  BiColumns,
  BiHide,
  BiFilter,
  BiRightArrow,
} from "react-icons/bi";
import { LegacyRef } from "react";
import { FilterTypesDropdown } from "./FilterTypesDropdown";

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

export function Dropdown(props: DropdownProps) {
  const { table, column, showFilterColumn, setShowFilterColumn } = props;
  console.log('showFilterColumn', showFilterColumn)
  const dropdownRef = useRef<HTMLElement>(null);

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

  const getAllColumnIds = () => table.getAllColumns().map((c) => c.id);

  const showColumnFilterDropdown = (colId: string | undefined) => {
    let showColumnsObj = {};
    getAllColumnIds().map((ci) => ((showColumnsObj as any)[ci] = ci === colId));
    setShowFilterColumn(showColumnsObj);
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

  const removeFilterHandler = () => {
    const removed = [...table.getState().columnFilters].filter(
      (f) => f.id !== column.id
    );
    table.setColumnFilters(removed);
  };
  
  const handleColumnVisibility = ()=> {
    column.toggleVisibility(false)
    
  }

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
        <a
          className={`dropdown-item text-style ${
            column.getIsFiltered() ? "" : "disabled"
          }`}
          onClick={removeFilterHandler}
        >
          <MdOutlineFilterListOff
            className={`filter-dropdown-icon`}
            size={18}
          />
          <span className="filter-dropdown-label">Cleare filter</span>
        </a>
        <a
          className={
            "dropdown-item text-style border_bottom d-flex justify-content-between align-items-center"
          }
        >
          <div>
            <BiFilter className="filter-dropdown-icon" size={18} />
            <span className="filter-dropdown-label">
              {" "}
              Filter by {column.id}
            </span>
          </div>
          <FilterTypesDropdown {...props} />
          {/* <span className="filter-types-dropdown">
            <BiRightArrow />
          </span> */}
        </a>
        <a className="dropdown-item text-style" onClick={handleColumnVisibility}>
          <BiHide className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Hide Column {column.id}</span>
        </a>
        <a className={`dropdown-item text-style ${table.getIsAllColumnsVisible()? 'disabled': ''}`} onClick={table.toggleAllColumnsVisible}>
          <BiColumns className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Show all columns</span>
        </a>
      </div>
    </div>
  ) : null;
}
