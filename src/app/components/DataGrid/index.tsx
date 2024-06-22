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
        "& .row-span-4": {
          position: "relative",
          minHeight: 52 * 4,
          background: "white",
          borderLeft: "1px solid var(--DataGrid-rowBorderColor)",
          borderRight: "1px solid var(--DataGrid-rowBorderColor)",
        },
        "& .row-span-3": {
          position: "relative",
          minHeight: 52 * 3,
          background: "white",
          borderLeft: "1px solid var(--DataGrid-rowBorderColor)",
          borderRight: "1px solid var(--DataGrid-rowBorderColor)",
        },
        "& .row-span-2": {
          position: "relative",
          minHeight: 52 * 2,
          background: "white",
          borderLeft: "1px solid var(--DataGrid-rowBorderColor)",
          borderRight: "1px solid var(--DataGrid-rowBorderColor)",
        },
        "& .row-span-1": {
          background: "white",
          borderLeft: "1px solid var(--DataGrid-rowBorderColor)",
          borderRight: "1px solid var(--DataGrid-rowBorderColor)",
        },
        "& .odd, & .today": {
          background: "#efefef",
        },
        "& .today:after": {
          content: "'(Today)'",
          display: "block",
          lineHeight: 1,
          fontSize: 12,
        },
      }}
      {...props}
    />
  );
};

export default DataGrid;
