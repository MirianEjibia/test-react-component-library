import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import { object } from "prop-types";
import { Row } from "react-bootstrap";

export const dateFilterFn: FilterFn<any> = (row, id, filterValus, meta) => {
  let sd = new Date(filterValus[0]);
  let ed = new Date(filterValus[1]);

  // console.log(rows, id, filterValus)
  var time = new Date(row.getValue(id));
  if (time >= sd || time <= ed) return true;
  else return false;
  // if (filterValus.length === 0) return ;
};

export const startsWithFilterFn: FilterFn<any> = (
  row,
  id,
  filterValue,
  meta
) => {
    const val = row?.getValue(id);
  return (val as string).toLowerCase().indexOf(filterValue.toLowerCase())===0
  // return (val as String)===filterValue;
};

export const endsWithFilterFn: FilterFn<any> = (row, id, filterValue : string, meta) => {
  const val:string= row.getValue(id)
  return val.toLowerCase().endsWith(filterValue.toLowerCase())
  // return true;
};

export const containsFilterFn: FilterFn<any> = (row, id, filterValue, meta) => {
  const val: string = row.getValue(id);
  return val.toLowerCase().includes(filterValue.toLowerCase());
};

export const equalsFilterFn: FilterFn<any> = (row, id, filterValue, meta) => {
  const val: string = row.getValue(id);
  return val.toLowerCase() === filterValue.toLowerCase();
};

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // debugger
  const itemRank = rankItem(row?.getValue(columnId), value);

  // Store the itemRank info
  addMeta &&
    addMeta({
      itemRank,
    });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface filterFunctions {
  key: string;
  function: FilterFn<any>;
}

export enum filterFnTypes {
  fuzzy = "fuzzy",
  startsWith = "startsWith",
  contains = "contains",
  endsWith = "endsWith",
  equals = "equals",
}

export var filterFunctions: filterFunctions[] = [
  {
    key: filterFnTypes.fuzzy,
    function: fuzzyFilter,
  },
  {
    key: filterFnTypes.startsWith,
    function: startsWithFilterFn,
  },
  {
    key: filterFnTypes.contains,
    function: containsFilterFn,
  },
  {
    key: filterFnTypes.endsWith,
    function: endsWithFilterFn,
  },
  {
    key: filterFnTypes.equals,
    function: equalsFilterFn,
  },
];
