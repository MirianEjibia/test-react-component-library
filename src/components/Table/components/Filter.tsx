import React from "react";
import { Table } from "@tanstack/react-table";
import { Column } from "react-table";
import DebouncedInput from "./DebouncedInput";

export function Filter({ column, table }: { column: any; table: Table<any> }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="d-flex space-x-2 ">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          // placeholder={`Min ${
          //   column.getFacetedMinMaxValues()?.[0]
          //     ? `(${column.getFacetedMinMaxValues()?.[0]})`
          //     : ''
          // }`}
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <div style={{marginLeft: 10}}>
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                value,
              ])
            }
            // placeholder={`Max ${
            //   column.getFacetedMinMaxValues()?.[1]
            //     ? `(${column.getFacetedMinMaxValues()?.[1]})`
            //     : ''
            // }`}
            placeholder={`Max`}
            className="ml-2 w-50 border shadow rounded"
          />
        </div>
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value: any) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      {/* <div className="h-1" /> */}
    </>
  );
}
