import React, { useState, useEffect } from 'react'
import Header from '../components/Header';
import { Typography, Box, TextField, Grid, Card, CardMedia } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";

import SnackBar from "../components/Snackbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const BASE_URL = "http://localhost:8000/api/v1";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const topImages = ["data:image/jpeg;base64,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",
  "https://code-projects.org/wp-content/uploads/2019/10/Screenshot-103.png", 
  "https://www.techringe.com/wp-content/uploads/2019/08/Doctor1.png",
  "https://www.riomed.com/wp-content/uploads/2021/11/blogpost.jpg",
  "https://t3.ftcdn.net/jpg/02/60/79/68/360_F_260796882_QyjDubhDDk0RZXV9z7XBEw9AKnWCizXy.jpg"
  ]
  const [doctors, setDoctors] = useState([]);
  const [doctorsToDisplay, setDoctorsToDisplay] = useState([]);
  const [patient, setPatient] = useState();
  const navigate = useNavigate();
  const [showValidationError, setshowValidationError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");
  const [openBookForm, setOpenBookForm] = useState(false);
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadPatientByUser();
    loadDoctors();
  }, [])

  const loadDoctors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/doctors`);
      if (response.data) {
        setDoctors(response.data);
        setDoctorsToDisplay(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loadPatientByUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/by-user/${localStorage.getItem("userId")}`);
      if (response.data) {
        setPatient(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleBookDoctor = async (doctor) => {
    setDoctorId(doctor.id)
    setDoctorName(doctor.name)
    if(!token){
      navigate("/login-register")
    }else{
      if(patient){
        setOpenBookForm(true);
      }else{
        navigate("/patient-dashboard");
      }
    }
  }

  const bookAppointment = async () => {
    if (
        date === ""
    ) {
        setshowValidationError(true);
    } else {
        const bookData = { patientName: patient.name, doctorName, date, doctorId, patientId: patient.id };
        try {
            const response = await axios({
                method: "post",
                url: BASE_URL + "/appointments/",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + token,
                },
                data: JSON.stringify(bookData)
            });

            if (response.data) {
                setOpenSnackbar(true);
                setSnackbarMessage("Appointment booked successfully");
                setSnackbarSeverity("success")
                setOpenBookForm(false);
            }
        } catch (err) {
            console.log(err);
            setOpenSnackbar(true);
            setSnackbarMessage("Some error occured while updating slot");
            setSnackbarSeverity("error")
        }
    }
};



  return (
    <div>
      <Header />
      <Box sx={{ mt: 8, maxWidth: "100%" }}>
      <SnackBar snackbarSeverity={snackbarSeverity} snackbarMessage={snackbarMessage} openSnackbar={openSnackbar}  setOpenSnackbar={setOpenSnackbar}/>
      <Dialog open={openBookForm} onClose={() => setOpenBookForm(false)}>
                <DialogTitle>Book Appointment</DialogTitle>
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
                            setDate(e.target.value);
                        }}
                        value={date}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                      disabled
                        size="small"
                        label="Doctor Id"
                        fullWidth
                        value={doctorId}
                        type="text"
                        onChange={(e) => {
                            setshowValidationError(false);
                            setDoctorId(e.target.value);
                        }}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        disabled
                        size="small"
                        label="Patient Name"
                        fullWidth
                        value={patient?.name}
                        type="text"
                        onChange={(e) => {
                            setshowValidationError(false);
                            setPatientName(e.target.value);
                        }}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                      disabled
                        value={doctorName}
                        size="small"
                        label="Doctor Name"
                        fullWidth
                        type="text"
                        onChange={(e) => {
                            setshowValidationError(false);
                            setDoctorName(e.target.value);
                        }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBookForm(false)}>Cancel</Button>
                    <Button onClick={() => bookAppointment()}>Book Appointment</Button>
                </DialogActions>
            </Dialog>
        <ImageSlider topImages={topImages} />

        <Box sx={{ display: "block",  justifyContent: "center", alignItems: "center", padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>
            <Typography sx={{ fontSize: 25 }}>Doctors</Typography>
          </Box>
          <Box sx={{mt: 2}}>
            <Grid container spacing={10}>
              { doctorsToDisplay && doctorsToDisplay.map((doctors, index)=> {
              return <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                  <Card sx={{cursor: "pointer"}} onClick={()=> handleBookDoctor(doctors)}>
                    <Box flexDirection="column" display="flex" justifyContent="center" alignItems="center">
                    <CardMedia
                        component="img"
                        height="300"
                        width="200"
                        image="https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg?w=2000"
                        alt={"Img1"}
                        sx={{mb: 0}}
                    />
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: 1}}>
                      <Typography sx={{mt: 0}} >{doctors.name}</Typography>
                      <Typography sx={{mt: 0}} >{`Specialities: ${doctors.specialities}`}</Typography>
                      <Typography sx={{mt: 0}} >{`Fee: ${doctors.fee}`}</Typography>

                    </Box>
                    </Box>
                  </Card>
              </Grid>})}
            </Grid>
          </Box>
        </Box>
       
      </Box>
    </div>
  )
}

export default Home