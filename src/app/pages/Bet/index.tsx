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

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const auth = getAuth();
  const role = useAppSelector((state) => state.auth.role);
  const [matchs, setMatchs] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);

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
            ...userBet,
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
      <Table className="border border-solid border-[#e0e0e0]">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 20 }}></TableCell>
            <TableCell style={{ width: 200 }}>Date</TableCell>
            <TableCell>Hour</TableCell>
            <TableCell>
              <p className="m-0 ml-3">Home</p>
            </TableCell>
            <TableCell>
              <p className="m-0 ml-3">Away</p>
            </TableCell>
            <TableCell>Forecast</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Deposit</TableCell>
            {role === "admin" && <TableCell style={{ width: 50 }}></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {getRows(matchs, bets).map((match: any, rowIndex: number) => {
            return (
              <TableRow key={match.id}>
                <TableCell>{rowIndex + 1}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell>{match.hour}</TableCell>
                <TableCell>
                  {moment().isBefore(match.datetime) && (
                    <Checkbox
                      checked={match.bet === "homeName"}
                      onClick={() => {
                        handleUpdateBet(match, "homeName");
                      }}
                    />
                  )}
                  {moment().isSameOrAfter(match.datetime) && (
                    <Checkbox checked={match.bet === "homeName"} disabled />
                  )}
                  {match.homeName}
                </TableCell>
                <TableCell>
                  {moment().isBefore(match.datetime) && (
                    <Checkbox
                      checked={match.bet === "awayName"}
                      onClick={() => {
                        handleUpdateBet(match, "awayName");
                      }}
                    />
                  )}
                  {moment().isSameOrAfter(match.datetime) && (
                    <Checkbox checked={match.bet === "awayName"} disabled />
                  )}
                  {match.awayName}
                </TableCell>
                <TableCell>{match.forecast}</TableCell>
                <TableCell>{match.result}</TableCell>
                <TableCell>{calcDeposit(match)}</TableCell>
                {role === "admin" && (
                  <TableCell>
                    <IconButton onClick={() => navigate(`/matchs/${match.id}`)}>
                      <Edit fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
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
