import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import { FormatCurrency, isLossedMatch } from "../../utils";
import { Check, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

const columns: GridColDef<any[number]>[] = [
  {
    field: "displayName",
    headerName: "Full Name",
    width: 150,
  },
  {
    field: "totalDeposit",
    headerName: "Deposit",
    width: 150,
    valueFormatter: (value) => {
      return FormatCurrency(value);
    },
  },
];

type Props = {};

const Leaderboard = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const [users, setUsers] = useState<any[]>([]);
  const [matchs, setMatchs] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let querySnapshot = await getDocs(query(collection(db, "users")));
    let listUsers: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataUsers = doc.data();
      listUsers.push({
        ...dataUsers,
        id: doc.id,
      });
    });
    setUsers(listUsers);

    querySnapshot = await getDocs(
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

    querySnapshot = await getDocs(query(collection(db, "bets")));
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

  const getColumns = (matchs: any[]) => {
    const newColumns: GridColDef<any[number]>[] = [
      {
        field: "displayName",
        headerName: "Full Name",
        width: 150,
      },
      {
        field: "totalDeposit",
        headerName: "Deposit",
        width: 150,
        valueFormatter: (value: any) => {
          return FormatCurrency(value);
        },
      },
    ];
    for (let i = 1; i <= matchs.length; i++) {
      newColumns.push({
        field: `match-${i}`,
        align: "center",
        sortable: false,
        headerName: `${matchs[i - 1].homeName
          .slice(0, 3)
          .toUpperCase()} vs ${matchs[i - 1].awayName
          .slice(0, 3)
          .toUpperCase()}`,
        renderCell: (params) => {
          const matchBet = params.row.matchBets[i - 1];
          if (!matchBet.result) {
            if (!matchBet.bet) {
              return "";
            }
            return (
              <Tooltip title={matchBet.forecast || ""}>
                {matchBet.bet === "homeName"
                  ? matchBet.homeName
                  : matchBet.awayName}
              </Tooltip>
            );
          }
          return (
            <IconButton>
              {params.value ? (
                <Close color="primary" />
              ) : (
                <Check color="error" />
              )}
            </IconButton>
          );
        },
      });
    }
    return newColumns;
  };

  const getRows = (users: any[], matchs: any[], bets: any[]) => {
    return users.map((user: any) => {
      const userBets: any = bets.filter((bets) => bets.user_id === user.id);
      const matchBets: any = matchs
        .map((match) => {
          const userBet = userBets.find(
            (bet: any) => bet.match_id === match.id
          );
          if (userBet) {
            return {
              ...match,
              ...userBet,
            };
          }
          return match;
        })
        .map((match) => ({
          ...match,
          needDeposit: match.result && isLossedMatch(match),
        }));
      const rows = {
        ...user,
        matchBets,
        totalDeposit: matchBets
          .filter((match: any) => match.needDeposit)
          .map((match: any) => match.deposit)
          .reduce((a: any, b: any) => a + b, 0),
      };
      for (let i = 1; i <= matchBets.length; i++) {
        rows[`match-${i}`] = matchBets[i - 1].needDeposit;
      }
      return rows;
    });
  };

  return (
    <div>
      <DataGrid
        columns={getColumns(matchs)}
        rows={getRows(users, matchs, bets)}
        disableColumnFilter
        disableColumnMenu
      />
    </div>
  );
};

export default Leaderboard;
