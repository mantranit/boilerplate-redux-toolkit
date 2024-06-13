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
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { getAuth } from "firebase/auth";

const fields = [
  "date",
  "hour",
  "homeName",
  "awayName",
  "forecast",
  "result",
  "deposit",
];

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const auth = getAuth();
  const [matchs, setMatchs] = useState<any[]>([]);

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
        lastModifiedAt: Timestamp.fromDate(new Date(match.datetime)),
      });
    } else {
      await addDoc(collection(db, "bets"), {
        bet,
        match_id: match.id,
        user_id: auth.currentUser?.uid,
        lastModifiedAt: Timestamp.fromDate(new Date(match.datetime)),
      });
    }
    fetchData();
  };

  const calcDeposit = (match: any) => {
    console.log(match);
  };

  return (
    <div>
      <Table className="border border-solid border-[#e0e0e0]">
        <TableHead>
          <TableRow>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {matchs.map((match, rowIndex) => {
            return (
              <TableRow key={match.id}>
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
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Bet;
