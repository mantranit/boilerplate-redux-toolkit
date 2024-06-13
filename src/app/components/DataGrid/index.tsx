import React from "react";
import { DataGrid as MuiDataGrid, DataGridProps } from "@mui/x-data-grid";

type Props = {} & DataGridProps;

const DataGrid = (props: Props) => {
  return (
    <div>
      <MuiDataGrid
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        {...props}
      />
    </div>
  );
};

export default DataGrid;
