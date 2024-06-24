import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import DataGrid from "../../components/DataGrid";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import { FormatCurrency } from "../../utils";

const columns: GridColDef<any[number]>[] = [
  {
    field: "round",
    headerName: "#",
    width: 200,
  },
  {
    field: "deposit",
    headerName: "Deposit",
    valueFormatter: FormatCurrency,
  },
];

type Props = {};

const Rule = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const [deposits, setDeposits] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let querySnapshot = await getDocs(
      query(collection(db, "deposits"), orderBy("deposit"))
    );
    let listDeposits: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataDeposits = doc.data();
      listDeposits.push({
        ...dataDeposits,
        id: doc.id,
      });
    });
    setDeposits(listDeposits);
  };
  return (
    <div className="max-w-96 mx-auto">
      <DataGrid columns={columns} rows={deposits} />
    </div>
  );
};

export default Rule;
