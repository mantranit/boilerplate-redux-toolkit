import React, { useContext, useEffect, useState } from "react";
import DataGrid from "../../components/DataGrid";
import { GridColDef } from "@mui/x-data-grid";
import Button from "../../components/Button";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useFirebaseApp } from "../../contexts/FirebaseProvider";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import TextField from "../../components/TextField";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

type Props = {};

const Nations = (props: Props) => {
  const app = useFirebaseApp();
  const db = getFirestore(app);
  const [isOpenForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // db.
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  return (
    <>
      <div className="flex mb-5 gap-4">
        <Button variant="outlined" onClick={() => setOpenForm(true)}>
          Add
        </Button>
      </div>
      <DataGrid rows={rows} columns={columns} />

      <Dialog
        open={isOpenForm}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            await setDoc(doc(db, "nations", formJson.code), {
              ...formJson,
              flag: "",
              photo: "",
            });
            handleClose();
          },
        }}
      >
        <DialogTitle>Add a Nation</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <div className="grid gap-4 min-w-96 my-4">
            <TextField required name="country" label="Country" />
            <TextField required name="code" label="Code" />
            <TextField required name="name" label="Name" />
            <TextField name="flag" label="Flag" />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Nations;
