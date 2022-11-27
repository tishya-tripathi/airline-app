import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { firebase, auth } from "../firebase";

const initialValues = {
  vendorName: "",
  orgName: "",
  phone: "",
  otp: "",
  emailotp: "",
  email: "",
  password: "",
  renterpwd: "",
};

// Used for snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

const AdminAddFlight = () => {
  const navigate = useNavigate();
  const axios = require("axios");


  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const credentials = {
      name: data.get("vendorName"),
      organization: data.get("orgName"),
      phoneno: data.get("phone"),
      verified: true,
      email: data.get("email"),
      password: data.get("password"),
      admin: false,
    };
    // window.userVerified = "Yes";              //    COMMENT THIS LINE TO ENABLE OTP VERIFICATION
    if (window.userVerified === "Yes" && emailVerified) {
      if (credentials.password === data.get("renterpwd")) {
        axios({
          url: "https://murudeshwar.org/register",
          method: "POST",
          withCredentials: true,
          crossDomain: true,
          data: credentials,
        }).then((res) => {
          console.log(res);
          if (res.data.status === "success") {
            window.sessionStorage.setItem("userEmail", res.data.profile.email);
            window.sessionStorage.setItem(
              "userVendorName",
              res.data.profile.name
            );
            window.sessionStorage.setItem(
              "userOrg",
              res.data.profile.organization
            );
            window.sessionStorage.setItem(
              "userPhone",
              res.data.profile.phoneno
            );
            navigate("/vendor/uploadtender");
          } else {
            setOpen(true);
          }
        });
      } else {
        window.alert("Password and Re-enter Password are not the same!");
        return;
      }
    } else {
      setOpen6(true);
    }
  };

  const [values, setValues] = React.useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value !== "") {
      setValues({
        ...values,
        [name]: value,
      });
    } else {
      setValues({
        ...values,
        [name]: null,
      });
    }
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sendOtpBtn",
      {
        size: "invisible",
        callback: (response) => {
          console.log("Recaptcha varified");
        },
        defaultCountry: "IN",
      }
    );
  };

  // const [emailText, setEmailText] = React.useState();
  const [emailVerified, setEmailVerified] = React.useState(false);

  const verifyEMAILOTP = () => {
    if (values.emailotp === "") return;
    // console.log("values.emailotp ", values.emailotp)
    // console.log("window.emailedText ", window.emailedText);
    if (values.emailotp == window.emailedText) {
      // snackbar Email Verified
      console.log("Email Verified");
      setEmailVerified(true);
      setOpen9(true);
    } else {
      // snackbar Email NOT Verified
      console.log("Email NOT Verified");
      setEmailVerified(false);
      setOpen7(true);
    }
  };

  const sendEMAILOTP = async () => {
    if (values.email == null) return;

    setEmailVerified(false);


    // -----------------------------------Using EMailJS----------------------------------------
    var templateParams = {
      vendor_email: values.email.toString(),
      message: window.emailedText.toString(),
    };
    await window.emailjs
      .send(
        "service_d9uzoqn",
        "template_remy2ow",
        templateParams,
        "jVJiCS_0zN5eGjcJC"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          setOpen10(true);
        },
        function (err) {
          console.log("FAILED...", err);
          setOpen8(true);
        }
      );

    // ---------------------------------------------------------------------------


  };



  // -----Opening and Closing snackbars-----
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const [open6, setOpen6] = React.useState(false);
  const [open7, setOpen7] = React.useState(false);
  const [open8, setOpen8] = React.useState(false);
  const [open9, setOpen9] = React.useState(false);
  const [open10, setOpen10] = React.useState(false);

  // ---------------------------------------

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
    setOpen6(false);
    setOpen7(false);
    setOpen8(false);
    setOpen9(false);
    setOpen10(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ background: "#021B38", height: "10vh" }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                margin: "1rem",
                flexGrow: 1,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              Add Flights
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Flight Number"
              name="flightNo"
              value={values.flightNo}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Flight Name"
              name="flightName"
              value={values.flightName}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Source"
              name="source"
              value={values.source}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Destination"
              name="destination"
              value={values.destination}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Duration"
              name="duration"
              value={values.duration}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Price"
              name="price"
              value={values.price}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="No of Seat"
              name="seat"
              value={values.seat}
              onChange={handleInputChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            Add Flight
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid Username or Password
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          OTP Verified
        </Alert>
      </Snackbar>
      <Snackbar open={open3} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          OTP Invalid
        </Alert>
      </Snackbar>
      <Snackbar open={open4} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          OTP sent successfully
        </Alert>
      </Snackbar>
      <Snackbar open={open5} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          OTP not sent
        </Alert>
      </Snackbar>
      <Snackbar open={open6} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Phone/Email Not Verified
        </Alert>
      </Snackbar>

      {/* EMAIL SNACKBARs */}
      <Snackbar open={open7} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Email Not Verified
        </Alert>
      </Snackbar>
      <Snackbar open={open8} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Invalid Email. OTP not sent.
        </Alert>
      </Snackbar>
      <Snackbar open={open9} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Email Verified
        </Alert>
      </Snackbar>
      <Snackbar open={open10} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          OTP sent to Email
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AdminAddFlight;
