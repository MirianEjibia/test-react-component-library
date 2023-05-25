import {
  ColumnDef,
  FilterFn,
  IdentifiedColumnDef,
  createColumnHelper,
  filterFns,
} from "@tanstack/react-table";
import { User } from "./models";
import IndeterminateCheckbox from "./components/IndeterminateCheckbox";
import React from "react";
import { DateRangeColumnFilter } from "./components/DateRangeColumnFilter";
import { Filter } from "./components/Filter";
import { Table } from "react-bootstrap";

const columnHelper = createColumnHelper<User>();

export const getColumns: (filterFn: FilterFn<any>) => ColumnDef<User, any>[] = (
  filterFn
) => [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
          className: "row-selection-check-box",
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
            className: "row-selection-check-box",
          }}
        />
      </div>
    ),
  }),
  columnHelper.accessor("id", {
    header: "Id",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
  }),
  columnHelper.accessor("first_name", {
    header: "First Name",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
    filterFn: filterFn,
    cell: (props) => {
      const cellValue = props.cell.getValue();
      const globalFilterValue = props.table.getState().globalFilter;
      const colFilterValue = props.table
        .getState()
        .columnFilters.find((cf) => cf.id === props.cell.column.id)?.value;
      const subStrings = cellValue.split(colFilterValue);
      console.log("subStrings", subStrings, cellValue, colFilterValue);
      return subStrings.length === 2 ? (
        <>
          <span>{subStrings[0]}</span>
          <span style={{ backgroundColor: "yellow" }}>{colFilterValue}</span>
          <span>{subStrings[1]}</span>
        </>
      ) : (
        <span> {cellValue} </span>
      );
      // console.log(
      //   "props",
      //   props.table
      //     .getState()
      //     .columnFilters.find((cf) => cf.id === props.cell.column.id)?.value,
      //   props.cell.getValue()
      // );
    },
  }),
  columnHelper.accessor("last_name", {
    header: "Last Name",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
  }),
  columnHelper.accessor("date_created", {
    header: "Date Created",
    meta: {
      filterComponent: (props: any) => <DateRangeColumnFilter {...props} />,
    },
    filterFn: "dateFilter",
  }),
  columnHelper.accessor("locked", {
    header: "Locked",
    meta: {
      filterComponent: (props: any) => <Filter {...props} />,
    },
  }),
];
