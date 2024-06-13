import React, { useEffect, useState } from "react";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";

const fields = ["date", "hour", "homeName", "awayName", "forecast", "result"];

type Props = {};

const Bet = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const [matchs, setMatchs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "matchs"), orderBy("time"))
    );
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const datetime = moment(data.time.seconds * 1000);
      list.push({
        ...data,
        id: doc.id,
        date: datetime.format("dddd, Do MMMM"),
        hour: datetime.format("HH:mm"),
      });
      console.log(doc.id, " => ", doc.data());
    });
    setMatchs(list);
  };
  return (
    <div>
      <Table className="border border-solid border-[#e0e0e0]">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: 170 }}>Date</TableCell>
            <TableCell>Hour</TableCell>
            <TableCell>Home</TableCell>
            <TableCell>Away</TableCell>
            <TableCell>Forecast</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matchs.map((match, rowIndex) => {
            return (
              <TableRow key={match.id}>
                {fields.map((field, colIndex) => {
                  return (
                    <TableCell key={match.id + field}>{match[field]}</TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Bet;
