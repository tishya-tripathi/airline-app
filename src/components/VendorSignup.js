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

const VendorSignup = () => {
  const navigate = useNavigate();
  const axios = require("axios");

  async function generateOTP() {
    var string =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = "";

    var len = string.length;
    for (let i = 0; i < 6; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }
    // console.log(OTP);
    window.emailedText = OTP;
    // setEmailText(OTP);
  }

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

    await generateOTP();

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

    // console.log("OTP: ", window.emailedText);
    // await window.Email.send({
    //     // SecureToken : "e204d4c7-a86a-4548-8d57-cc70da753e55",
    //     Host : "smtp.elasticemail.com",
    //     Username : "tender@murudeshwartempletender.com",
    //     Password : "",
    //     To: values.email.toString(),
    //     From: "tender@murudeshwartempletender.com",
    //     Subject: "One Time Password for Murudeshwar Temple Tender",
    //     Body:  window.emailedText.toString() + "\tThis your 6-digit OTP for Murudeshwar Temple Tender.",
    // }).then((message) =>
    // {
    //   console.log(message);
    //   if (message == "OK")
    //   {
    //     // snackbar "OTP Sent to EMail"
    //     console.log("OTP Sent");
    //     setOpen10(true);
    //   }
    //   else
    //   {
    //     // snackbar "Invalid EMail"
    //     console.log("OTP Not Sent");
    //     setOpen8(true);
    //   }
    // });
  };

  const verifyOTP = () => {
    let code = values["otp"];
    window.result
      .confirm(code)
      .then(() => {
        window.userVerified = "Yes";
        setOpen2(true);
        console.log("OTP Verified");
      })
      .catch((error) => {
        setOpen3(true);
        console.log(error);
      });
  };

  const sendOTP = () => {
    if (values.phone.toString() === "" || values.phone.toString().length < 10)
      return;
    let phoneNumber = "+91" + values.phone.toString();

    configureCaptcha();
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((result) => {
        window.result = result;
        setOpen4(true);
        console.log("OTP has been sent");
      })
      .catch((error) => {
        setOpen5(true);
        console.log("SMS not sent");
        window.location.reload();
      });
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
              Airline Management Portal
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
              label="User Name"
              name="vendorName"
              value={values.vendorName}
              onChange={handleInputChange}
            />

            <TextField
              margin="normal"
              required
              type="phone"
              fullWidth
              label="Phone Number (+91)"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
            />
            <div id="recaptcha-container"></div>


            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              value={values.email}
              onChange={handleInputChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="renterpwd"
              label="Re-enter Password"
              type="password"
              value={values.renterpwd}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
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

export default VendorSignup;
