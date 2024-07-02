import React, { useEffect, useState } from "react";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  deleteDoc,
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import { getDeposits } from "../../../services/betsServices";
import { REQUEST_STATUS } from "../../utils/enums";

type Props = {};

const BetDetails = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);
  const getDepositsStatus = useAppSelector(
    (state) => state.bets.getDepositsStatus
  );
  const deposits = useAppSelector((state) => state.bets.deposits);
  const { match_id } = useParams();
  const { control, handleSubmit, setValue, watch, reset, getValues } = useForm({
    defaultValues: {
      homeName: "",
      awayName: "",
      time: moment(),
      deposit: "",
      forecast: "",
      result: "",
    },
  });
  const [open, setOpen] = useState(false);

  if (role !== "admin") {
    navigate("/leaderboard");
  }

  useEffect(() => {
    if (getDepositsStatus === REQUEST_STATUS.IDLE) {
      dispatch(getDeposits({ db }));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
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

  const handleCloseDelete = () => {
    setOpen(false);
  };

  const handleAgreeDelete = async () => {
    if (match_id) {
      await deleteDoc(doc(db, "matchs", match_id));
      setOpen(false);
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

  const canDelete =
    match_id && role === "admin" && moment().isBefore(getValues("time"));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center gap-5">
        <h2>{!!match_id ? "Edit" : "Add"} a Match</h2>
        {canDelete && (
          <>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Delete
            </Button>
            <Dialog
              open={open}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Delete a Match</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure to delete this match?
                </DialogContentText>
              </DialogContent>
              <DialogActions className="justify-center gap-2 pb-5">
                <Button
                  variant="contained"
                  onClick={handleAgreeDelete}
                  autoFocus
                  className="w-24"
                >
                  Agree
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseDelete}
                  className="w-24"
                >
                  Disagree
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
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
              options={deposits.map((deposit: any) => ({
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
