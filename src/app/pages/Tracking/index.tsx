import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import { getFirestore } from "firebase/firestore";
import { GridColDef } from "@mui/x-data-grid";
import {
  FormatCurrency,
  hasHistory,
  isDisplay,
  isLossedMatch,
} from "../../utils";
import { Check, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import DataGrid from "../../components/DataGrid";
import { REQUEST_STATUS } from "../../utils/enums";
import { getMatchs } from "../../../services/matchsServices";
import { getBets, getDeposits } from "../../../services/betsServices";
import { getUsers } from "../../../services/authServices";
import Button from "../../components/Button";
import moment from "moment";

type Props = {
  isLeaderboard?: boolean;
};

const Tracking = ({ isLeaderboard = false }: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const dispatch = useAppDispatch();
  const getDepositsStatus = useAppSelector(
    (state) => state.bets.getDepositsStatus
  );
  const deposits = useAppSelector((state) => state.bets.deposits);
  const getMatchsStatus = useAppSelector(
    (state) => state.matchs.getMatchsStatus
  );
  const matchs = useAppSelector((state) => state.matchs.matchs);
  const getBetsStatus = useAppSelector((state) => state.bets.getBetsStatus);
  const bets = useAppSelector((state) => state.bets.bets);
  const getUsersStatus = useAppSelector((state) => state.auth.getUsersStatus);
  const users = useAppSelector((state) => state.auth.users);
  const [isFull, setFull] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (getDepositsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getDeposits({ db }));
    }
    if (getUsersStatus === REQUEST_STATUS.IDLE) {
      dispatch(getUsers({ db }));
    }
    if (getMatchsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getMatchs({ db }));
    }
    if (getBetsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getBets({ db }));
    }
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
      if (!isFull && !isDisplay(deposits, matchs[i - 1].deposit)) {
        continue;
      }
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
            if (
              !isLeaderboard ||
              (matchBet.bet &&
                moment().isAfter(moment(matchBet.time.seconds * 1000)))
            ) {
              return (
                <Tooltip title={params.row.displayName}>
                  {matchBet.bet === "homeName" ? (
                    <span>{matchBet.homeName}</span>
                  ) : (
                    <span>{matchBet.awayName}</span>
                  )}
                </Tooltip>
              );
            }
            return <></>;
          }
          return (
            <Tooltip title={params.row.displayName}>
              <IconButton>
                {params.value ? (
                  <Close color="primary" />
                ) : (
                  <Check color="error" />
                )}
              </IconButton>
            </Tooltip>
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

  const loading =
    getUsersStatus === REQUEST_STATUS.PENDING ||
    getMatchsStatus === REQUEST_STATUS.PENDING ||
    getBetsStatus === REQUEST_STATUS.PENDING;

  return (
    <div>
      <div className="my-4">
        <div className="flex items-center justify-between gap-5">
          <h3>
            Total: &nbsp;{" "}
            {FormatCurrency(
              getRows(users, matchs, bets)
                .map((match: any) => match.totalDeposit)
                .reduce((a: any, b: any) => a + b, 0)
            )}
          </h3>
          <div>
            {hasHistory(deposits) && (
              <Button
                variant={isFull ? "contained" : "outlined"}
                onClick={() => setFull((isFull) => !isFull)}
              >
                Toggle history
              </Button>
            )}
          </div>
        </div>
      </div>
      <DataGrid
        loading={loading}
        columns={getColumns(matchs)}
        rows={getRows(users, matchs, bets)}
      />
    </div>
  );
};

export default Tracking;
