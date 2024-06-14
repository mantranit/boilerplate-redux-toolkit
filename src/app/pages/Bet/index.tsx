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

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const auth = getAuth();
  const role = useAppSelector((state) => state.auth.role);
  const [matchs, setMatchs] = useState<any[]>([]);
  let totalDeposit = 0;

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
      const datetime = moment(dataMatchs.time.seconds * 1000);
      listMatchs.push({
        ...dataMatchs,
        id: doc.id,
        date: datetime.format("dddd, Do MMMM"),
        hour: datetime.format("HH:mm"),
        datetime,
      });
    });

    querySnapshot = await getDocs(
      query(
        collection(db, "bets"),
        where("user_id", "==", auth.currentUser?.uid)
      )
    );

    querySnapshot.forEach((doc) => {
      const dataBet = doc.data();
      listMatchs = listMatchs.map((match) => {
        if (match.id === dataBet.match_id) {
          return { ...match, bet: dataBet.bet, bet_id: doc.id };
        }
        return match;
      });
    });
    setMatchs(listMatchs);
  };

  const handleUpdateBet = async (match: any, bet: string) => {
    if (match.bet_id) {
      await updateDoc(doc(db, "bets", match.bet_id), {
        bet,
        match_id: match.id,
        user_id: auth.currentUser?.uid,
      });
    } else {
      await addDoc(collection(db, "bets"), {
        bet,
        match_id: match.id,
        user_id: auth.currentUser?.uid,
      });
    }
    fetchData();
  };

  const calcDeposit = (match: any) => {
    if (!match.result) {
      return "-";
    }
    const forecastArr = match.forecast
      .split("-")
      .map((str: any) => parseFloat(str));
    const resultArr = match.result
      .split("-")
      .map((str: any) => parseFloat(str));

    const forecastSub = forecastArr[0] - forecastArr[1];
    const resultSub = resultArr[0] - resultArr[1];
    if (
      !match.bet ||
      (match.bet === "awayName" && forecastSub < resultSub) ||
      (match.bet === "homeName" && forecastSub > resultSub)
    ) {
      totalDeposit += match.deposit;
      return new Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
      }).format(match.deposit);
    }
    return "-";
  };

  return (
    <div>
      <div className="flex items-center justify-between my-4">
        {role === "admin" && (
          <Button variant="contained" component={Link} href="/add">
            Add Match
          </Button>
        )}
        <div>
          <h3>
            Total: &nbsp;
            {new Intl.NumberFormat("vn-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalDeposit)}
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
          {matchs.map((match, rowIndex) => {
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
