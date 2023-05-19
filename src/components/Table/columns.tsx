import {
  ColumnDef,
  IdentifiedColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";
import { User } from "./models";
import IndeterminateCheckbox from "./components/IndeterminateCheckbox";
import React from "react";
import { DateRangeColumnFilter } from "./components/DateRangeColumnFilter";
import { Filter } from "./components/Filter";

const columnHelper = createColumnHelper<User>();

export const COLUMNS: ColumnDef<User, any>[] = [
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
