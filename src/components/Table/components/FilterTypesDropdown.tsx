import { Column, Table } from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineClearAll, MdOutlineFilterListOff } from "react-icons/md";
import {
  BiSortUp,
  BiSortDown,
  BiColumns,
  BiHide,
  BiFilter,
  BiRightArrow,
  BiRightArrowAlt,
} from "react-icons/bi";
import { LegacyRef } from "react";
import { VscSearchFuzzy } from "react-icons/vsc";
import {TbBracketsContain, TbBracketsContainEnd, TbBracketsContainStart, TbEqual} from 'react-icons/tb'
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

interface FilterTypesDropdownProps {
  column: Column<any>;
  table: Table<any>;
}

export function FilterTypesDropdown({
  table,
  column,
}: FilterTypesDropdownProps) {
  const dropdownRef = useRef<HTMLElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    let handler = (e: Event) => {
      if (!dropdownRef.current!.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });


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

  return column.getCanFilter() ? (
    <div
      className="dropdown"
      ref={dropdownRef as LegacyRef<HTMLDivElement> | undefined}
      key={column.id}
    >
      <button
        className="filter-btn"
        type="button"
        id="filterTypesdropdownMenuBtn"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setShowDropdown(true)}
      >
        <BiRightArrowAlt />
      </button>
      <div
        className={`dropdown-menu ${
          showDropdown  ? "show" : ""
        }`}
        aria-labelledby="filterTypesdropdownMenuBtn"
      >
        <a
          className={`dropdown-item text-style pl-1`}
          onClick={column.clearSorting}
        >
          <VscSearchFuzzy className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Fuzzy</span>
        </a>
        <a
          className={`dropdown-item text-style pl-1`}
          onClick={column.clearSorting}
        >
          <TbBracketsContain className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Contains</span>
        </a>
        <a
          className={`dropdown-item text-style pl-1`}
          onClick={column.clearSorting}
        >
          <TbBracketsContainStart className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Starts with</span>
        </a>
        <a
          className={`dropdown-item text-style pl-1`}
          onClick={column.clearSorting}
        >
          <TbBracketsContainEnd className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Ends with</span>
        </a>
        <a
          className={`dropdown-item text-style pl-1`}
          onClick={column.clearSorting}
        >
          <TbEqual className="filter-dropdown-icon" size={18} />
          <span className="filter-dropdown-label"> Equals</span>
        </a>
      </div>
    </div>
  ) : null;
}
