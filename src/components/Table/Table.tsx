import React, { RefObject, useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { COLUMNS } from "./columns";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import {
  BiColumns,
  BiFullscreen,
  BiSearch,
  BiVerticalBottom,
} from "react-icons/bi";

import { AiOutlineFullscreenExit } from "react-icons/ai";
import {
  MdOutlineFilterListOff,
  MdFilterList,
  MdDensitySmall,
  MdOutlineDensityLarge,
  MdDensityMedium,
  MdDensityLarge,
} from "react-icons/md";
import { BsArrowsFullscreen } from "react-icons/bs";
import { MdSearchOff } from "react-icons/md";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  FilterFns,
  SortingState,
} from "@tanstack/react-table";

import "./Table.css";

import { useTable, usePagination } from "react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "./components/DebouncedInput";
import { Filter } from "./components/Filter";
import TestSelect from "./components/TestSelect";
import { dateFilterFn } from "./helperFunction/filterFunctions/dateFilterFn";
import { icons } from "react-icons";
import { Dropdown } from "./components/Dropdown";
import { ColumnVisibilityControlDropdown } from "./components/ColumnVisibilityControlDropdown";
import { Table as TanstackTable } from "@tanstack/react-table";
enum DencityTypes {
  small = "small",
  medium = "medium",
  larg = "larg",
}

enum DencityTypesInPixels {
  small = 5,
  medium = 13,
  larg = 20,
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    dateFilter: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
  interface ColumnMeta<TData extends unknown, TValue> {
    filterComponent: any;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface TableProps {
  backgroundColo: string;
  size: string;
  color: string;
  spacing: string;
  align: string;
}

const Table = ({ backgroundColo, size, spacing, color, align }: TableProps) => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => require("./MOCK_DATA.json"), []);
  const ref = useRef<HTMLElement>(null);
  const [showFilterColumn, setShowFilterColumn] = useState({});
  const [fullScrrenMode, setFullScreenMode] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [dencityType, setDencityType] = useState(DencityTypes.medium);
  const [showColFilters, setShowColFilters] = useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnFilters,
      globalFilter,
      sorting
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      dateFilter: dateFilterFn,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const onRemoveFilterHandler = (selection: any, meta: any) => {
    const filtered = [...columnFilters].filter(
      (c) => c.id !== meta?.removedValue?.value
    );
    setColumnFilters(filtered);
  };
  const toggleGlobalSearch = () => setShowGlobalSearch((prev) => !prev);

  function toggleFullScreen(elementRef: RefObject<HTMLElement>) {
    var isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = elementRef.current;
    if (!isInFullScreen) {
      setFullScreenMode(true);
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      setFullScreenMode(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  return (
    <div ref={ref} className="table-comopnent-wrapper">
      <div className="my-3 d-flex justify-content-end">
        {columnFilters?.length > 0 && (
          <div className="d-flex justify-content-end align-items-center selected-filters-collection">
            {/* <span className="pr-2"> Filter(s) : </span> */}
            <div className="w-75 mx-3">
              <TestSelect
                options={columnFilters.map((f) => ({
                  value: f.id,
                  label: columns.find((c) => c.accessorKey === f.id)?.header,
                }))}
                onChange={onRemoveFilterHandler}
              />
            </div>
            <button
              className="btn btn-light btn-small ml-3 mr-3 btn-colors"
              onClick={() => {
                table.resetColumnFilters(), table.resetGlobalFilter();
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="d-flex">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className={`p-2 font-lg shadow border border-block global-search-input ${
              !showGlobalSearch && "hide-global-search"
            }`}
            placeholder="Search all columns..."
            style={
              !showGlobalSearch
                ? { width: "0px", padding: "4px 0px" }
                : { width: "200px" }
            }
            autoFocus={true}
          />
          <span
            className="table-options-icons-wrapper"
            onClick={toggleGlobalSearch}
          >
            {showGlobalSearch ? <MdSearchOff /> : <BiSearch />}
          </span>
          <span
            className="table-options-icons-wrapper"
            onClick={() => setShowColFilters((prev) => !prev)}
          >
            {showColFilters ? <MdFilterList /> : <MdOutlineFilterListOff />}
          </span>
          {
            <ColumnVisibilityControlDropdown
              table={table}
              showFilterColumn={showFilterColumn}
              setShowFilterColumn={setShowFilterColumn}
            />
          }
          <span className="table-options-icons-wrapper">
            {dencityType === DencityTypes.medium && (
              <MdDensityMedium
                onClick={() => setDencityType(DencityTypes.larg)}
              />
            )}
            {dencityType === DencityTypes.larg && (
              <MdDensityLarge
                onClick={() => setDencityType(DencityTypes.small)}
              />
            )}
            {dencityType === DencityTypes.small && (
              <MdDensitySmall
                onClick={() => setDencityType(DencityTypes.medium)}
              />
            )}
          </span>
          <span
            className="table-options-icons-wrapper"
            onClick={() => toggleFullScreen(ref)}
          >
            {fullScrrenMode ? <AiOutlineFullscreenExit /> : <BiFullscreen />}
          </span>
        </div>
      </div>
      <table
        className="w-100"
        style={{
          backgroundColor: backgroundColo,
          color: color,
          width: "23% !importante",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                console.log(
                  "header.column.getIsSorted()",
                  header.column.getIsSorted()
                );
                return (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div className="d-flex">
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <span>↑</span>,
                              desc: <span>↓</span>,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() && (
                            <Dropdown
                              column={header.column}
                              table={table}
                              showFilterColumn={showFilterColumn}
                              setShowFilterColumn={setShowFilterColumn}
                            />
                          )}
                        </div>
                        {header.column.columnDef.header === ""}
                        {header.column.getCanFilter() && showColFilters ? (
                          <div>
                            {header.column.columnDef?.meta?.filterComponent({
                              column: header.column,
                              table: table,
                            })}
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: `${DencityTypesInPixels[dencityType]}px 0px`,
                    textAlign: align,
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex items-center gap-2 mt-5 w-100 justify-content-end">
        <button
          className="small btn btn-light btn-sm  border rounded pv-1 btn-colors pagination-btn blue-border-radius-five "
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="btn btn-light border btn-sm  rounded pv-1 btn-colors pagination-btn blue-border-radius-five "
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="btn btn-light border btn-sm  rounded pv-1 btn-colors pagination-btn blue-border-radius-five "
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="btn btn-light border  btn-sm rounded pv-1 btn-colors pagination-btn blue-border-radius-five "
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="d-flex items-center gap-1 align-items-center pagination-text">
          <span>Page</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1 pagination-text">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 blue-border-radius-five "
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="blue-border-radius-five pagination-text"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

Table.prototype = {
  backgroundColo: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  aligh: PropTypes.oneOf(["left", "center", "right"]),
  spacing: PropTypes.string,
  color: PropTypes.string,
};

export default Table;
