import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";

import {
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "../components/Snackbar";


import { useNavigate } from "react-router-dom";

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

const AdminPanel = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const [openSuccessSnack, setOpenSuccessSnack] = useState(false);
  const [openErrorSnack, setOpenErrorSnack] = useState(false);
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [parkingAreas, setDoctors] = useState([]);

  const [patients, setPatients] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  useEffect(()=> {
    if(!token){
      navigate("/login-register");
  }
    if(role==="DOCTOR"){
      navigate("/doctor-dashboard");
    }else if(role==="PATIENT"){
      navigate("/patient-dashboard");
    }
},[])

useEffect(() => {
  loadDoctors();
}, [])


const loadDoctors = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/doctors`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data) {
      setDoctors(response.data);
    }
  } catch (error) {
    console.log(error);
  }
}

  const loadPatients = async () => {
    try {
      const response = await axios({
        method: "get",
        url: BASE_URL + "/patients",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        }
      });
      if (response.data) {
        setPatients(response.data)
      }
    } catch (err) {
      console.log(err);
      setOpenErrorSnack(true);
      setErrorMsg("Error occured while loading patients");
    }
};

const deletePatient = async (id) => {
  try {
    const response = await axios({
      method: "delete",
      url: BASE_URL + "/patients/"+id,
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      }
    });
    if (response.data) {
      setSnackbarMessage("Patient deleted successfully");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
      loadPatients();
    }
  } catch (err) {
    setSnackbarMessage("Error occured while deleteing patients");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
};


  useEffect(() => {
   loadPatients();
  }, []);

  const deleteDoctors = async (id) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${BASE_URL}/doctors/${id}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response) {
        setSnackbarMessage("Parking area deleted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        loadDoctors()
      }
    } catch (error) {
      setSnackbarMessage("Parking area couldn't deleted");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }

  return (
    <div>
      <Header />
      <Box sx={{mt: 9, padding: 1}}>
        <Box sx={{ mt: 5, mb: 1 }}>
            <Snackbar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarMessage={snackbarMessage} snackbarSeverity={snackbarSeverity} />
            <Box display="flex">
            <Typography variant="h5" color="initial">
             Doctors
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Doctor Id (Id)</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">Specialities</StyledTableCell>
                  <StyledTableCell align="right">Fees</StyledTableCell>
                  <StyledTableCell align="right">
                    Email
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    Contact Number
                  </StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parkingAreas &&
                  parkingAreas.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell component="th" scope="row">
                        {row.id}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        component="th"
                        scope="row"
                      >
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.specialities}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.fee}</StyledTableCell>
                      <StyledTableCell align="right">{row.email}</StyledTableCell>
                      <StyledTableCell align="right">{row.contactNumber}</StyledTableCell>
                      <StyledTableCell align="right">
                        <DeleteIcon
                          sx={{ cursor: "pointer", ml: 2 }}
                          onClick={() => deleteDoctors(row.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

          <Box display="flex" sx={{mt: 5}}>
            <Typography variant="h5" color="initial">
              Patients
            </Typography>
          </Box>
          <Box sx={{ mt: 2, overflowX:"auto" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Patient (Id)</StyledTableCell>
                    <StyledTableCell align="right">Name</StyledTableCell>
                    <StyledTableCell align="right">Contact No.</StyledTableCell>
                    <StyledTableCell align="right">
                      Email
                    </StyledTableCell>
                    <StyledTableCell align="right">Symptoms</StyledTableCell>
                    <StyledTableCell align="right">Age</StyledTableCell>
                    <StyledTableCell align="right">Weight</StyledTableCell>
                    <StyledTableCell align="right">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients &&
                    patients.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          component="th"
                          scope="row"
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.contactNumber}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.symptoms}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.age}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.weight}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <DeleteIcon
                            titleAccess="Delete"
                            sx={{ cursor: "pointer", ml: 2 }}
                            onClick={() => deletePatient(row.id)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default AdminPanel;