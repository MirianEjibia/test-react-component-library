import { FilterFn } from "@tanstack/react-table";

export const dateFilterFn: FilterFn<any> = (row, id, filterValus, meta) => {
  let sd = new Date(filterValus[0]);
  let ed = new Date(filterValus[1]);

  // console.log(rows, id, filterValus)
  var time = new Date(row.getValue(id));
  if (time >= sd || time <= ed) return true;
  else return false;
  // if (filterValus.length === 0) return ;
};
