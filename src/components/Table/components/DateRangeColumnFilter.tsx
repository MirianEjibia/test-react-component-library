import { Table } from "@tanstack/react-table";
import React from "react";

export function DateRangeColumnFilter({
  column,
  table,
}: {
  column: any;
  table: Table<any>;
}) {
  const { getFilterValue, setFilterValue, id } = column;
  const filterValue = getFilterValue();
  const preFilteredRows = table.getPreFilteredRowModel().rowsById;
  const [min, max] = React.useMemo(() => {
    let min: Date = new Date(preFilteredRows[0].getValue(id));
    let max: Date = new Date(preFilteredRows[0].getValue(id));
    Array.from(preFilteredRows).map((row) => {
      min = new Date(row.values[id]) <= min ? new Date(row.values[id]) : min;
      max = new Date(row.values[id]) >= max ? new Date(row.values[id]) : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: "flex",
      }}
      className="my-2"
    >
      <input
        className="debounce-input"
        value={filterValue ? filterValue[0] : ""}
        type="date"
        min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [val ? val : undefined, old[1]]);
        }}
        style={{
          width: "170px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        className="debounce-input"
        value={filterValue ? filterValue[1] : ""}
        type="date"
        max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [old[0], val ? val : undefined]);
        }}
        style={{
          width: "170px",
          marginLeft: "0.5rem",
        }}
      />
    </div>
  );
}
