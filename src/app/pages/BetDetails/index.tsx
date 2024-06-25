import React, { useEffect, useState } from "react";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/store";
import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { Link } from "@mui/material";
import { toast } from "react-toastify";

type Props = {};

const BetDetails = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const role = useAppSelector((state) => state.auth.role);
  const [deposits, setDeposits] = useState<any[]>([]);
  const { match_id } = useParams();
  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      homeName: "",
      awayName: "",
      time: moment(),
      deposit: "",
      forecast: "",
      result: "",
    },
  });

  if (role !== "admin") {
    navigate("/leaderboard");
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let querySnapshot = await getDocs(
      query(collection(db, "deposits"), orderBy("deposit"))
    );
    let listDeposits: any[] = [];
    querySnapshot.forEach((doc) => {
      const dataDeposits = doc.data();
      listDeposits.push({
        ...dataDeposits,
        id: doc.id,
      });
    });
    setDeposits(listDeposits);

    if (match_id) {
      const docRef = doc(db, "matchs", match_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        reset({
          homeName: data.homeName,
          awayName: data.awayName,
          time: moment(data.time.seconds * 1000),
          deposit: data.deposit,
          forecast: data.forecast,
          result: data.result,
        });
      } else {
        toast.error("No such document!");
      }
    }
  };

  const handleOnSuccess = async (data: any) => {
    const time = Timestamp.fromDate(new Date(data.time));
    const payload = {
      ...data,
      time,
      deposit: parseInt(data.deposit, 10),
    };
    if (match_id) {
      await updateDoc(doc(db, "matchs", match_id), payload);
    } else {
      await addDoc(collection(db, "matchs"), payload);
    }
    navigate("/");
  };
  return (
    <div className="max-w-3xl mx-auto">
      <h2>{!!match_id ? "Edit" : "Add"} a Match</h2>
      <form onSubmit={handleSubmit(handleOnSuccess)}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <TextField
              disabled={moment().isSameOrAfter(watch("time"))}
              control={control}
              rules={{
                required: "This field is required.",
              }}
              name="homeName"
              label="Home Team"
            />
            <TextField
              disabled={moment().isSameOrAfter(watch("time"))}
              control={control}
              rules={{
                required: "This field is required.",
              }}
              name="awayName"
              label="Away Team"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <DateTimePicker
              className="w-full"
              label="Time"
              value={watch("time")}
              onChange={(newValue) => setValue("time", newValue!)}
              disabled={moment().isSameOrAfter(watch("time"))}
            />
            <TextField
              options={deposits.map((deposit) => ({
                value: deposit.deposit,
                label: deposit.round,
              }))}
              disabled={moment().isSameOrAfter(watch("time"))}
              control={control}
              rules={{
                required: "This field is required.",
              }}
              name="deposit"
              label="Deposit"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <TextField
              disabled={moment().isSameOrAfter(watch("time"))}
              control={control}
              name="forecast"
              label="Forecast"
            />
            <TextField control={control} name="result" label="Result" />
          </div>
          <div className="flex gap-5">
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Button component={Link} href="/">
              Back
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BetDetails;
