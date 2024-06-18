import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormatCurrency, isLossedMatch } from "../../utils";
import { Check, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAppSelector } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

type Props = {};

const Tracking = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const role = useAppSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [matchs, setMatchs] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);

  if (role !== "admin") {
    navigate("/leaderboard");
  }

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
        field: "rank",
        headerName: "#",
        width: 10,
      },
      {
        field: "displayName",
        headerName: "Full Name",
        sortable: false,
        width: 150,
      },
      {
        field: "totalDeposit",
        headerName: "Deposit",
        sortable: false,
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
                {matchBet.bet === "homeName" ? (
                  <span>{matchBet.homeName}</span>
                ) : (
                  <span>{matchBet.awayName}</span>
                )}
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
    return users
      .map((user: any) => {
        const userBets: any = bets.filter((bets) => bets.user_id === user.id);
        const matchBets: any = matchs
          .map((match) => {
            const userBet = userBets.find(
              (bet: any) => bet.match_id === match.id
            );
            if (userBet) {
              return {
                ...match,
                bet: userBet.bet,
                bet_id: userBet.id,
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
      })
      .sort((a, b) => b.totalDeposit - a.totalDeposit)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  };

  return (
    <div>
      <div className="my-4">
        <div>
          <h3>
            Total: &nbsp;{" "}
            {FormatCurrency(
              getRows(users, matchs, bets)
                .map((match: any) => match.totalDeposit)
                .reduce((a: any, b: any) => a + b, 0)
            )}
          </h3>
        </div>
      </div>
      <DataGrid
        columns={getColumns(matchs)}
        rows={getRows(users, matchs, bets)}
        disableColumnFilter
        disableColumnMenu
        disableRowSelectionOnClick
        disableMultipleRowSelection
      />
    </div>
  );
};

export default Tracking;
