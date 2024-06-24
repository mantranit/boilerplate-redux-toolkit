import { DataGridProps, DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import React from "react";

type Props = {} & DataGridProps;

const DataGrid = (props: Props) => {
  return (
    <MuiDataGrid
      disableColumnSorting
      disableColumnFilter
      disableColumnMenu
      disableRowSelectionOnClick
      disableMultipleRowSelection
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      sx={{
        "& .MuiDataGrid-virtualScrollerContent": { minHeight: 52 },
        "& .row-span": {
          position: "relative",
          background: "white",
          borderLeft: "1px solid var(--DataGrid-rowBorderColor)",
          borderRight: "1px solid var(--DataGrid-rowBorderColor)",
        },
        "& .row-span-4": {
          minHeight: 52 * 4,
        },
        "& .row-span-3": {
          minHeight: 52 * 3,
        },
        "& .row-span-2": {
          minHeight: 52 * 2,
        },
        "& .odd, & .today": {
          background: "#efefef",
        },
      }}
      {...props}
    />
  );
};

export default DataGrid;
