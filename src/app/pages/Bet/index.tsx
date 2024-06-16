import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Checkbox,
  FormLabel,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { getAuth } from "firebase/auth";
import { useAppSelector } from "../../../redux/store";
import Button from "../../components/Button";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FormatCurrency, isLossedMatch } from "../../utils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const auth = getAuth();
  const role = useAppSelector((state) => state.auth.role);
  const [matchs, setMatchs] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "id",
      headerName: "#",
      width: 10,
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row.id) + 1,
    },
    { field: "date", headerName: "Date", width: 200 },
    { field: "hour", headerName: "Hour" },
    {
      field: "homeName",
      headerName: "Home",
      width: 200,
      headerClassName: "!pl-6",
      renderCell: (params) => {
        return (
          <>
            <Checkbox
              checked={params.row.bet === "homeName"}
              disabled={moment().isSameOrAfter(params.row.datetime)}
              onClick={() => {
                handleUpdateBet(params.row, "homeName");
              }}
            />
            <FormLabel>{params.value}</FormLabel>
          </>
        );
      },
    },
    {
      field: "awayName",
      headerName: "Away",
      width: 200,
      headerClassName: "!pl-6",
      renderCell: (params) => {
        return (
          <>
            <Checkbox
              checked={params.row.bet === "awayName"}
              disabled={moment().isSameOrAfter(params.row.datetime)}
              onClick={() => {
                handleUpdateBet(params.row, "awayName");
              }}
            />
            <FormLabel>{params.value}</FormLabel>
          </>
        );
      },
    },
    { field: "forecast", headerName: "Forecast" },
    { field: "result", headerName: "Result" },
    {
      field: "deposit",
      headerName: "Deposit",
      valueGetter: (value, row) => {
        if (!row.result) {
          return "-";
        }
        if (row.needDeposit) {
          return FormatCurrency(value);
        }
        return 0;
      },
    },
    {
      field: "actions",
      headerName: "",
      renderCell: (params) => {
        if (role === "admin") {
          return (
            <IconButton onClick={() => navigate(`/matchs/${params.row.id}`)}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          );
        }
        return "";
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let querySnapshot = await getDocs(
      query(collection(db, "matchs"), orderBy("time"))
    );
    let listMatchs: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataMatchs = doc.data();
      listMatchs.push({
        ...dataMatchs,
        id: doc.id,
      });
    });
    setMatchs(listMatchs);

    querySnapshot = await getDocs(
      query(
        collection(db, "bets"),
        where("user_id", "==", auth.currentUser?.uid)
      )
    );
    let listBets: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataBets = doc.data();
      listBets.push({
        ...dataBets,
        id: doc.id,
      });
    });
    setBets(listBets);
  };

  const handleUpdateBet = async (match: any, bet: string) => {
    const updateMatch = {
      bet,
      match_id: match.id,
      user_id: auth.currentUser?.uid,
    };
    if (match.bet_id) {
      await updateDoc(doc(db, "bets", match.bet_id), updateMatch);
    } else {
      await addDoc(collection(db, "bets"), updateMatch);
    }
    fetchData();
  };

  const calcDeposit = (match: any) => {
    if (!match.result) {
      return "-";
    }
    if (match.needDeposit) {
      return FormatCurrency(match.deposit);
    }
    return FormatCurrency(0);
  };

  const getRows = (matchs: any[], bets: any[]) => {
    const matchBets: any = matchs
      .map((match) => {
        const datetime = moment(match.time.seconds * 1000);
        const userBet = bets.find((bet: any) => bet.match_id === match.id);
        let newMatch = {
          ...match,
          date: datetime.format("dddd, Do MMMM"),
          hour: datetime.format("HH:mm"),
          datetime,
        };
        if (userBet) {
          newMatch = {
            ...newMatch,
            bet: userBet.bet,
            bet_id: userBet.id,
          };
        }
        return newMatch;
      })
      .map((match) => ({
        ...match,
        needDeposit: match.result && isLossedMatch(match),
      }));
    return matchBets;
  };

  return (
    <div>
      <div className="my-4">
        <div>
          <h3>
            Total: &nbsp;{" "}
            {FormatCurrency(
              getRows(matchs, bets)
                .filter((match: any) => match.needDeposit)
                .map((match: any) => match.deposit)
                .reduce((a: any, b: any) => a + b, 0)
            )}
          </h3>
        </div>
      </div>
      <DataGrid
        columns={columns}
        rows={getRows(matchs, bets)}
        disableColumnSorting
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        disableMultipleRowSelection
      />
      <div className="my-4">
        {role === "admin" && (
          <Button variant="contained" component={Link} href="/add">
            Add Match
          </Button>
        )}
      </div>
    </div>
  );
};

export default Bet;
