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
      sx={{
        "& .MuiDataGrid-virtualScrollerContent": { minHeight: 52 },
      }}
      {...props}
    />
  );
};

export default DataGrid;
