import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Checkbox, FormLabel, IconButton, Link } from "@mui/material";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import Button from "../../components/Button";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FormatCurrency, isLossedMatch } from "../../utils";
import { GridCellParams, GridColDef } from "@mui/x-data-grid";
import DataGrid from "../../components/DataGrid";
import { REQUEST_STATUS } from "../../utils/enums";
import { getMatchs } from "../../../services/matchsServices";
import { getCurrentUser } from "../../../services/authServices";
import { getBetsByUser, getDeposits } from "../../../services/betsServices";

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const userCredential = useAppSelector((state) => state.auth.userCredential);
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const getDepositsStatus = useAppSelector(
    (state) => state.bets.getDepositsStatus
  );
  const deposits = useAppSelector((state) => state.bets.deposits);
  const getMatchsStatus = useAppSelector(
    (state) => state.matchs.getMatchsStatus
  );
  const matchs = useAppSelector((state) => state.matchs.matchs);
  const getCurrentUserStatus = useAppSelector(
    (state) => state.auth.getCurrentUserStatus
  );
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const getBetsByUserStatus = useAppSelector(
    (state) => state.bets.getBetsByUserStatus
  );
  const betsByUser = useAppSelector((state) => state.bets.betsByUser);
  const [isFull, setFull] = useState(false);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "index",
      headerName: "#",
      width: 20,
      cellClassName: (params: GridCellParams<any>) => {
        return "bg-white";
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      cellClassName: (params: GridCellParams<any>) => {
        return `${
          params.row?.rowSpan ? `row-span row-span-${params.row.rowSpan}` : ""
        }${params.row?.datetime.isSame(new Date(), "day") ? ` today` : ""}`;
      },
    },
    { field: "hour", headerName: "Hour" },
    {
      field: "homeName",
      headerName: "Home",
      width: 180,
      align: "right",
      headerAlign: "right",
      headerClassName: "!pr-6",
      renderCell: (params) => {
        return (
          <>
            <FormLabel>{params.value}</FormLabel>
            <Checkbox
              checked={params.row.bet === "homeName"}
              disabled={moment().isSameOrAfter(params.row.datetime)}
              onClick={() => {
                handleUpdateBet(params.row, "homeName");
              }}
            />
          </>
        );
      },
    },
    {
      field: "forecast",
      headerName: "Forecast",
      align: "center",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "awayName",
      headerName: "Away",
      width: 180,
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
    if (userCredential) {
      fetchData();
    }
  }, [userCredential]);

  const fetchData = async () => {
    if (getDepositsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getDeposits({ db }));
    }
    if (getCurrentUserStatus === REQUEST_STATUS.IDLE) {
      dispatch(getCurrentUser({ db, userId: userCredential.uid }));
    }
    if (getMatchsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getMatchs({ db }));
    }
    if (getBetsByUserStatus === REQUEST_STATUS.IDLE) {
      dispatch(getBetsByUser({ db, userId: userCredential.uid }));
    }
  };

  const handleUpdateBet = async (match: any, bet: string) => {
    const updateMatch = {
      bet,
      match_id: match.id,
      user_id: userCredential.uid,
    };
    let item;
    if (match.bet_id) {
      item = await updateDoc(doc(db, "bets", match.bet_id), updateMatch);
    } else {
      item = await addDoc(collection(db, "bets"), updateMatch);
    }
    dispatch(getBetsByUser({ db, userId: userCredential.uid }));
  };

  const updateUserBets = async (bets: any[]) => {
    const dataUser = { ...currentUser };
    for (let i = 0; i < bets.length; i++) {
      const bet = bets[i];
      dataUser[bet.match_id] = {
        bet: bet.bet,
        bet_id: bet.id,
      };
    }

    await updateDoc(doc(db, "users", userCredential.uid), dataUser);
  };

  const isDisplay = (deposit: number) => {
    const exist = deposits.find((obj: any) => obj.deposit === deposit);
    return exist && exist.display;
  };

  const getRows = (matchs: any[], bets: any[], sum = false) => {
    if (userCredential && sum) {
      updateUserBets(bets);
    }
    const groupMatchs = matchs.filter((match) => isDisplay(match.deposit));
    const matchBets: any = matchs
      .filter(
        (match) =>
          sum || isFull || (isFull === false && !isDisplay(match.deposit))
      )
      .map((match, index) => {
        const datetime = moment(match.time.seconds * 1000);
        const userBet = bets.find((bet: any) => bet.match_id === match.id);
        let newMatch = {
          ...match,
          date: datetime.format("dddd, Do MMMM"),
          hour: datetime.format("HH:mm"),
          datetime,
          index: index + 1 + (isFull ? 0 : groupMatchs.length),
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
    return matchBets.map((match: any, index: number) => {
      if (
        index === 0 ||
        (index > 0 && match.date !== matchBets[index - 1].date)
      ) {
        return {
          ...match,
          rowSpan: matchBets.filter((m: any) => m.date === match.date).length,
        };
      }
      return match;
    });
  };

  const loading =
    getMatchsStatus === REQUEST_STATUS.PENDING ||
    getCurrentUserStatus === REQUEST_STATUS.PENDING ||
    getBetsByUserStatus === REQUEST_STATUS.PENDING;

  return (
    <div>
      <div className="my-4">
        <div className="flex items-center justify-between gap-5">
          <h3>
            Total: &nbsp;{" "}
            {FormatCurrency(
              getRows(matchs, betsByUser, true)
                .filter((match: any) => match.needDeposit)
                .map((match: any) => match.deposit)
                .reduce((a: any, b: any) => a + b, 0)
            )}
          </h3>
          <div>
            <Button
              variant={isFull ? "contained" : "outlined"}
              onClick={() => setFull(!isFull)}
            >
              Toggle history
            </Button>
          </div>
        </div>
      </div>
      <DataGrid
        loading={loading}
        columns={columns}
        rows={getRows(matchs, betsByUser)}
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
