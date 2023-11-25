import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Container, Typography, Box, Button, Grid, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import Header from '../components/Header';
import Snackbar from "../components/Snackbar";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
import BookedAppointments from './BookedAppoinment';

const BASE_URL = "http://localhost:8000/api/v1";

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        marginTop: 4,
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        marginTop: 4,
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 2,
    },
    label: {
        marginRight: 2,
        fontWeight: 'bold',
    },
    value: {
        fontSize: '1.2rem',
    },
    button: {
        marginTop: 4,
    },
}));

const DoctorDashboard = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("role");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [user, setUser] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [addressError, setaddressError] = useState(false)
    const [address, setaddress] = useState()
    const [timeTo, settimeTo] = useState()
    const [timeFrom, settimeFrom] = useState()
    const [fee, setfee] = useState()
    const [contactNumberError, setContactNumberError] = useState(false)
    const [timeToError, settimeToError] = useState(false)
    const [timeFromError, settimeFromError] = useState(false)
    const [feeError, setfeeError] = useState(false)
    const [role, setRole] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [specialities, setSpacialities] = useState();
    const [contactNumber, setContactNumber] = useState();
    const [specialityError, setSpecialityError] = useState(false)
    const [doctor, setDoctor] = useState();


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    
    useEffect(()=> {
        if(roles!="DOCTOR"){
            navigate("/")
        }
    }, [])
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [])

    useEffect(() => {
        loadLoggedInUserProfile()
        loadDoctorProfile()
    }, [])

    const loadLoggedInUserProfile = async () => {
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/users/logged-in-user`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setUser(response.data);

            } else {
                setSnackbarMessage("Couldn't load profile");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load profile");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const loadDoctorProfile = async () => {
        
        try {
            const response = await axios({
                method: 'get',
                url: `${BASE_URL}/doctors/by-user/${localStorage.getItem('userId')}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            console.log(response);
            if (response.data) {
                setDoctor(response.data);

            } else {
                setSnackbarMessage("Couldn't load profile");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load profile");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const createDoctorProfile = async () => {
        console.log("Created")
        let er = false;
        const data = {
            email,
            contactNumber,
            address,
            name: firstName +" "+ lastName,
            specialities,
            timeTo,
            timeFrom,
            fee,
            userId: localStorage.getItem("userId")

        }

        if(fee===""){
            er=true;
            setfeeError(true);
        }else{
            setfeeError(false)
        }
        if(timeTo===""){
            er=true;
            settimeTo(true);
        }else{
            settimeTo(false)
        }

        if(timeFrom===""){
            er=true;
            settimeFrom(true);
        }else{
            settimeFrom(false)
        }

        if (email === "" || !validateEmail(email)) {
            er = true;
            setEmailError(true)
        } else {
            setEmailError(false)
        }
        if (firstName === "") {
            er = true;

            setFirstNameError(true)
        } else {
            setFirstNameError(false)
        }

        if (lastName === "") {
            er = true;
            setLastNameError(true)
        } else {
            setLastNameError(false)
        }

        if (address === "") {
            er = true;
            setaddressError(true)
        } else {
            setaddressError(false)
        }

        if (contactNumber === "" || contactNumber.length != 10) {
            er = true;
            setContactNumberError(true)
        } else {
            setContactNumberError(false)
        }
        if (specialities === "") {
            er = true;
            setSpecialityError(true)
        } else {
            setSpecialityError(false)
        }
        try {
            if(er) throw "Error";
            const response = await axios({
                method: 'post',
                url: `${BASE_URL}/doctors`,
                data,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setDoctor(response.data);

            } else {
                setSnackbarMessage("Couldn't load profile");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load profile");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const updateDoctorProfile = async () => {

        let er = false;
        const data = {
            email,
            contactNumber,
            address,
            name: firstName+" "+lastName,
            specialities,
            timeTo,
            timeFrom,
            fee,
            userId: localStorage.getItem("userId")
        }

        if(fee===""){
            er=true;
            setfeeError(true);
        }else{
            setfeeError(false)
        }
        if(timeTo===""){
            er=true;
            settimeTo(true);
        }else{
            settimeTo(false)
        }

        if(timeFrom===""){
            er=true;
            settimeFrom(true);
        }else{
            settimeFrom(false)
        }

        if (email === "" || !validateEmail(email)) {
            er = true;
            setEmailError(true)
        } else {
            setEmailError(false)
        }
        if (firstName === "") {
            er = true;

            setFirstNameError(true)
        } else {
            setFirstNameError(false)
        }

        if (lastName=== "") {
            er = true;
            setLastNameError(true)
        } else {
            setLastNameError(false)
        }

        if (address=== "") {
            er = true;
            setaddressError(true)
        } else {
            setaddressError(false)
        }

        if (contactNumber === "" || contactNumber.length != 10) {
            er = true;
            setContactNumberError(true)
        } else {
            setContactNumberError(false)
        }
        if (specialities === "") {
            er = true;
            setSpecialityError(true)
        } else {
            setSpecialityError(false)
        }
        try {
            if(er) throw "Error";
            const response = await axios({
                method: 'put',
                url: `${BASE_URL}/doctors/${doctor.id}`,
                data,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (response.data) {
                setDoctor(response.data);
            } else {
                setSnackbarMessage("Couldn't load profile");
                setSnackbarSeverity("error");
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage("Couldn't load profile");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            console.log(error);
        }
    }

    const handleEditProfile = () => {
        const name = doctor.name.split(" ")
        setFirstName(name[0]);
        setLastName(name[name.length - 1]);
        setEmail(doctor.email);
        setContactNumber(doctor.contactNumber);
        setaddress(doctor.address);
        setfee(doctor.fee);
        settimeFrom(doctor.timeFrom);
        settimeTo(doctor.timeTo);
        setSpacialities(doctor.specialities)
    };


  return (
    <div>
        <Header/>
        <Box sx={{ mt: 5, padding: 5 }}>
            <Box sx={{padding: 1, border: "1px solid grey"}}>
            <Grid container spacing={4}>
                    <Grid item xs={6}>

                       {doctor ? <Box maxWidth="sm" sx={{ padding: 1 }} >
                            <Box sx={{ paddingTop: 1, paddingLeft: 1, mb: 1, bgcolor: "#fff" }} display="flex">
                                <Typography variant="h4" gutterBottom>
                                    Profile
                                </Typography>
                            </Box>

                            {doctor && <Box sx={{ paddingTop: 2, paddingLeft: 1, pb: 2, mb: 1, bgcolor: "#fff" }}>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Name:</Typography>
                                    <Typography className={classes.value}>{doctor.name}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>ID:</Typography>
                                    <Typography className={classes.value}>{doctor.id}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Time From:</Typography>
                                    <Typography className={classes.value}>{doctor.timeFrom}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Time To:</Typography>
                                    <Typography className={classes.value}>{doctor.timeTo}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Address:</Typography>
                                    <Typography className={classes.value}>{doctor.address}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Contact Number:</Typography>
                                    <Typography className={classes.value}>{doctor.contactNumber}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Email:</Typography>
                                    <Typography className={classes.value}>{doctor.email}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Fee:</Typography>
                                    <Typography className={classes.value}>{doctor.fee}</Typography>
                                </div>
                                <div className={classes.infoItem}>
                                    <Typography className={classes.label}>Specialities:</Typography>
                                    <Typography className={classes.value}>{doctor.specialities}</Typography>
                                </div>
                            </Box>}
                            <Button fullWidth variant="contained" color="primary" sx={{bgcolor: "#6f42c1"}} className={classes.button} onClick={handleEditProfile}>
                                Edit Profile
                            </Button>
                        </Box> : <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "400px"}}>
                            <Typography>No Doctor Profile Found</Typography>
                            <Button variant="contained" sx={{bgcolor: "green", mt: 2}}>Create Profile</Button>
                        </Box> }
                    </Grid>
                    <Grid item xs={6}>
                        <ThemeProvider theme={theme}>
                            <Container sx={{ marginTop: 0, bgcolor: "#fff", padding: 1 }} component="main" maxWidth="xs">
                                <CssBaseline />
                                <Box
                                    sx={{
                                        marginTop: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    {error && <Alert severity="error">Error occured, while editing profile</Alert>}
                                    {success && <Alert severity="success">Profile updated successfully</Alert>}
                                    <Typography component="h1" variant="h5">
                                        {doctor ? "Edit Profile" : "Create Profile"}
                                    </Typography>
                                    <Box
                                        component="form"
                                        noValidate
                                        sx={{ mt: 3 }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={firstName}
                                                    error={firstNameError}
                                                    helperText={firstNameError ? "Enter first name" : ""}
                                                    onChange={(e) => {
                                                        setFirstName(e.target.value)
                                                        setFirstNameError(false)
                                                    }}
                                                    name="firstName"
                                                    required
                                                    fullWidth
                                                    id="firstName"
                                                    label={firstName?"": "First Name"}
                                                    
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={lastName}
                                                    error={lastNameError}
                                                    helperText={lastNameError ? "Enter last name" : ""}
                                                    onChange={(e) => {
                                                        setLastName(e.target.value)
                                                        setLastNameError(false)
                                                    }}
                                                    required
                                                    fullWidth
                                                    id="lastName"
                                                    label={lastName?"": "Last Name"}
                                                    name="lastName"
                                                    
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={email}
                                                    error={emailError}
                                                    helperText={emailError ? "Enter valid email" : ""}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value)
                                                        setEmailError(false)
                                                    }}
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label={email?"": "Email"}
                                                    name="email"
                                                    autoComplete="email"

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={contactNumber}
                                                    error={contactNumberError}
                                                    helperText={contactNumberError ? "Enter valid contact number" : ""}
                                                    onChange={(e) => {
                                                        setContactNumber(e.target.value)
                                                        setContactNumberError(false)
                                                    }}
                                                    required
                                                    fullWidth
                                                    id="contactNumber"
                                                    label={contactNumber?"": "Contact Number"}
                                                    name="contactNumber"
                                                    autoComplete="contactNumber"
                                                    type="number"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={timeTo}
                                                    error={timeToError}
                                                    helperText={timeToError ? "Enter valid time to" : ""}
                                                    onChange={(e) => {
                                                        settimeTo(e.target.value)
                                                        settimeToError(false)
                                                    }}
                                                    required
                                                    fullWidth
                                                    id="timeTo"
                                                    label={timeTo?"": "Time to"}
                                                    name="timeTo"
                                                    autoComplete="timeTo"
                                                    type="time"

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    small
                                                    value={timeFrom}
                                                    error={timeFromError}
                                                    helperText={timeFromError ? "Enter valid time from" : ""}
                                                    onChange={(e) => {
                                                        settimeFrom(e.target.value)
                                                        settimeFromError(false)
                                                    }}
                                                    required
                                                    fullWidth
                                                    id="timeFrom"
                                                    label={timeFrom ? "": "Time From"}
                                                    name="timeFrom"
                                                    autoComplete="timeFrom"
                                                    type="time"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    error={addressError}
                                                    value={address}
                                                    helperText={addressError ? "Enter valid address" : ""}
                                                    onChange={(e) => {
                                                        setaddress(e.target.value)
                                                        setaddressError(false)}}
                                                    required
                                                    fullWidth
                                                    id="address"
                                                    label={address?"": "Address"}
                                                    name="address"
                                                    autoComplete="address"
                                                    type="text"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    error={feeError}
                                                    value={fee}
                                                    helperText={feeError ? "Enter valid fee" : ""}
                                                    onChange={(e) => {
                                                        setfee(e.target.value)
                                                        setfeeError(false)}}
                                                    required
                                                    fullWidth
                                                    id="fee"
                                                    label="Fee"
                                                    name="fee"
                                                    autoComplete="fee"
                                                    type="number"
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={specialities}
                                                    error={specialityError}
                                                    helperText={specialityError ? "Enter valid specialities" : ""}
                                                    onChange={(e) =>{ setSpecialityError(false)
                                                        setSpacialities(e.target.value)
                                                    }}
                                                    required
                                                    fullWidth
                                                    name="specialities"
                                                    label="Specialities"
                                                    type="text"
                                                    id="specialities"
                                                    autoComplete="new-specialities"
                                                />
                                            </Grid>
                                          
                                        </Grid>
                                        <Button
                                            onClick={()=> {
                                                if(doctor){
                                                    updateDoctorProfile()
                                                   
                                                }else{
                                                    createDoctorProfile()
                                                }
                                            }}
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, bgcolor: "green" }}
                                        >
                                            {doctor ? "Edit Profile" : "Create Profile"}
                                        </Button>

                                    </Box>
                                </Box>
                            </Container>
                        </ThemeProvider>
                    </Grid>
                </Grid>
            </Box>

            <Box>
            {doctor && <BookedAppointments userType={"doctor"} pdid={doctor.id}/>}
            </Box>
        </Box>
    </div>
  )
}

export default DoctorDashboard