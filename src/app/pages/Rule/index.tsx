import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import DataGrid from "../../components/DataGrid";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FormatCurrency } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getDeposits } from "../../../services/betsServices";
import { REQUEST_STATUS } from "../../utils/enums";
import { Switch } from "@mui/material";

type Props = {};

const Rule = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const getDepositsStatus = useAppSelector(
    (state) => state.bets.getDepositsStatus
  );
  const deposits = useAppSelector((state) => state.bets.deposits);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "round",
      headerName: "",
      width: 200,
    },
    {
      field: "deposit",
      headerName: "Deposit",
      valueFormatter: FormatCurrency,
    },
    {
      field: "display",
      headerName: role === "admin" ? "Display" : "",
      hideable: true,
      renderCell: (params: GridRenderCellParams) => {
        if (role === "admin") {
          const { id, ...updateDeposit } = params.row;
          return (
            <Switch
              checked={params.value}
              onChange={async (event) => {
                await updateDoc(doc(db, "deposits", params.row.id), {
                  ...updateDeposit,
                  display: event.target.checked,
                });
                dispatch(getDeposits({ db }));
              }}
            />
          );
        }
        return <></>;
      },
    },
  ];

  useEffect(() => {
    if (getDepositsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getDeposits({ db }));
    }
  }, []);

  return (
    <div className="max-w-96 mx-auto">
      <DataGrid
        loading={getDepositsStatus === REQUEST_STATUS.PENDING}
        columns={columns}
        rows={deposits}
      />
    </div>
  );
};

export default Rule;
