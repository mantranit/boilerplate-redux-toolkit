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
import { GridColDef } from "@mui/x-data-grid";
import { FormatCurrency, isLossedMatch } from "../../utils";
import { Check, Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import moment from "moment";
import DataGrid from "../../components/DataGrid";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { REQUEST_STATUS } from "../../utils/enums";
import { getMatchs } from "../../../services/matchsServices";
import { getUsers } from "../../../services/authServices";

type Props = {};

const Leaderboard = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const dispatch = useAppDispatch();
  const getMatchsStatus = useAppSelector(
    (state) => state.matchs.getMatchsStatus
  );
  const matchs = useAppSelector((state) => state.matchs.matchs);
  const getUsersStatus = useAppSelector((state) => state.auth.getUsersStatus);
  const users = useAppSelector((state) => state.auth.users);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (getUsersStatus === REQUEST_STATUS.IDLE) {
      dispatch(getUsers({ db }));
    }
    if (getMatchsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getMatchs({ db }));
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
              matchBet.bet &&
              moment().isAfter(moment(matchBet.time.seconds * 1000))
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

  const getRows = (users: any[], matchs: any[]) => {
    return users
      .map((user: any) => {
        const matchBets: any = matchs
          .map((match) => {
            const userBet = user[match.id];
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
              getRows(users, matchs)
                .map((match: any) => match.totalDeposit)
                .reduce((a: any, b: any) => a + b, 0)
            )}
          </h3>
        </div>
      </div>
      <DataGrid
        loading={
          getUsersStatus === REQUEST_STATUS.PENDING ||
          getMatchsStatus === REQUEST_STATUS.PENDING
        }
        columns={getColumns(matchs)}
        rows={getRows(users, matchs)}
      />
    </div>
  );
};

export default Leaderboard;
