import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useNavigate } from "react-router-dom";
import SnackBar from "../components/Snackbar";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));


const BookedAppointments = ({userType, pdid}) => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const [showValidationError, setshowValidationError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [openEditForm, setOpenEditForm] = useState(false);
    const [bookedSlots, setAppointments] = useState([]);
    const [currentAppointment, setCurrentAppointment] = useState({});

    useEffect(()=> {
        if(!token){
          navigate("/login-register");
      }
    },[])

    useEffect(()=> {
        loadAppointments();
    }, [])

    const updateAppointment = async () => {
        if (
            currentAppointment.date===""
        ) {
            setshowValidationError(true);
        } else {
            const bookSlotdata = { patientName: currentAppointment.patientName, doctorName: currentAppointment.doctorName, date: currentAppointment.date, doctorId: currentAppointment.doctorId, patientId:currentAppointment.patientId };
            try {
                const response = await axios({
                    method: "put",
                    url: BASE_URL + "/appointments/"+currentAppointment.id,
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    data: JSON.stringify(bookSlotdata)
                });

                if (response.data) {
                    setOpenSnackbar(true);
                    setSnackbarMessage("Appointment updated successfully");
                    setSnackbarSeverity("success")
                    loadAppointments();
                    setOpenEditForm(false);
                }
            } catch (err) {
                console.log(err);
                setOpenSnackbar(true);
                setSnackbarMessage("Some error occured while updating appointment");
                setSnackbarSeverity("error")
            }
        }
    };

    const cancelAppointment = async (id) => {
        try {
            const response = await axios({
                method: "delete",
                url: BASE_URL + "/appointments/" + id,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });

            if (response) {
                setOpenSnackbar(true);
                setSnackbarMessage("Appointment cancelled successfully");
                setSnackbarSeverity("success")
                loadAppointments();
            }
        } catch (err) {
            console.log(err);
            setOpenSnackbar(true);
            setSnackbarMessage("Some error occured while cancelling appointment");
            setSnackbarSeverity("error")
        }
    };

    const loadAppointments = async () => {
        let url = BASE_URL + "/appointments/"
        if(userType==="patient"){
            url=url+"by-patient/"+pdid
        }else  if(userType==="doctor"){
            url=url+"by-doctor/"+pdid
        }
        try {
            const response = await axios({
                method: "get",
                url,
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            if (response.data) {
              setAppointments(response.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleOpenEditForm = (appointment) => {
        setCurrentAppointment(appointment);
        setOpenEditForm(true);
      };

    return (
        <div>
            <Header />
            <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar}  setOpenSnackbar={setOpenSnackbar}/>
            <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
                <DialogTitle>Book appointment</DialogTitle>
                <DialogContent>
                    {showValidationError && (
                        <Alert severity="error">All the fields are mandatory</Alert>
                    )}
                    <TextField
                        size="small"
                        label="Date"
                        fullWidth
                        type="date"
                        onChange={(e) => {
                            setshowValidationError(false);
                            setCurrentAppointment({...currentAppointment, date: e.target.value});
                        }}
                        value={currentAppointment.date}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        size="small"
                        label="Doctor Name"
                        fullWidth
                        value={currentAppointment.doctorName}
                        type="text"
                        sx={{ mt: 2 }}
                        disabled
                    />
                    <TextField
                        size="small"
                        label="Patient Name"
                        value={currentAppointment.patientName}
                        fullWidth
                        type="text"
                        disabled
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditForm(false)}>Cancel</Button>
                    <Button onClick={() => updateAppointment()}>Update Appointment</Button>
                </DialogActions>
            </Dialog>
            <Box sx={{mt: 12, padding: 2, mb: 20}}>
            <Box display="flex">
          <Typography variant="h5" color="initial">
            Booked Slots
          </Typography>
        </Box>
        <Box sx={{ mt: 2, mb: 20 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Appointment (Id)</StyledTableCell>
                  <StyledTableCell align="right">Doctor Name</StyledTableCell>
                  <StyledTableCell align="right">Patient Name</StyledTableCell>
                  <StyledTableCell align="right">Doctor Id</StyledTableCell>
                  <StyledTableCell align="right">
                   Patient Id
                  </StyledTableCell>
                  <StyledTableCell align="right">
                   Date
                  </StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookedSlots &&
                  bookedSlots.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {row.doctorName}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.patientName}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.doctorId}</StyledTableCell>
                      <StyledTableCell align="right">{row.patientId}</StyledTableCell>
                      <StyledTableCell align="right">{row.date}</StyledTableCell>
                      <StyledTableCell align="right">
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleOpenEditForm(row)}
                        />
                        <DeleteIcon
                        title="Cancel Appointment"
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => cancelAppointment(row.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        </Box>

        </div>
    )
}

export default BookedAppointments