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
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        {...props}
      />
    </div>
  );
};

export default DataGrid;
