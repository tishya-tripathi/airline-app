import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import Stack from "@mui/material/Stack";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useNavigate } from "react-router-dom";
import AdminCardComponent from "./AdminCardComponent";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import "./Styles.css";

axios.defaults.withCredentials = true;

const AdminUploadTender = () => {
  const theme = useTheme();
  const formatDate = (param) => {
    var x = new Date(param);
    var date = ("0" + x.getDate().toString()).slice(-2);
    var month = ("0" + (x.getMonth() + 1).toString()).slice(-2);
    var year = x.getFullYear().toString();

    var mins = x.getMinutes().toString();
    var hours = x.getHours().toString();

    return month + "/" + date + "/" + year + "  " + hours + ":" + mins;
  };
  const navigate = useNavigate();

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [data, setData] = React.useState([]); // Delete before deploy {tenderName: "Test Tender XYZ", startDate: "Oct 07 2022 09:37", endDate: "Oct 20 2022 11:30", minTenderAmount: 55000}
  const [check, setCheck] = React.useState(0);

  React.useEffect(() => {
    axios({
      url: "https://murudeshwar.org/all_admin_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log(res);
      let temp_data = [];
      for (let i = 0; i < res.data.length; i++) {
        const obj = {
          tenderName: res.data[i].tenderName,
          startDate: res.data[i].profile.startDate,
          endDate: res.data[i].profile.endDate,
          minTenderAmount: res.data[i].profile.minTenderAmount,
        };
        temp_data.push(obj);
      }
      setData(temp_data);
    });

    const checkStatus = async () => {
      try {
        const resp = await axios({
          url: "https://murudeshwar.org/status",
          method: "GET",
          withCredentials: true,
          crossDomain: true,
        }).then((res) => {
          console.log(res);
        });
      } catch (err) {
        console.log(err);
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (check === 1 || check === 0) {
      const formData = new FormData(event.currentTarget);
      formData.append("file", selectedFile);
      const newTender = {
        // File Upload
        minTenderAmount: formData.get("minTenderAmount"),
        tenderName: formData.get("tenderName"),
        startDate: startDate.toString().slice(4, 21), //formatDate(startDate),
        endDate: endDate.toString().slice(4, 21), //formatDate(endDate),
        admin: true,
        file_upload: formData.get("file"),
      };
      console.log(newTender);

      // Add check for dates & file upload mandatory

      if (newTender.file_upload === "null") {
        window.alert("File Upload is mandatory!");
        return;
      } else if (newTender.minTenderAmount == "") {
        window.alert("Minimum Tender Amount cannot be 0");
        return;
      } else if (newTender.startDate === newTender.endDate) {
        window.alert("Start Date and End Date cannot be same!");
        return;
      } else {
        // AXIOS Connection - TODO
        try {
          const response = await axios({
            method: "post",
            url: "https://murudeshwar.org/upload_vender_admin",
            data: newTender,
            headers: { "Content-Type": "multipart/form-data" },
          }).then((res) => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleFileSelect = (event) => {
    // console.log(event.target.files[0]);
    if (event.target.files[0].type != "application/pdf")
      window.location.reload();
    setSelectedFile(event.target.files[0]);
  };

  const [values, setValues] = React.useState({
    tenderName: "Tender Name",
    minTenderAmount: "",
  });

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

  const logout = () => {
    axios({
      url: "https://murudeshwar.org/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      console.log(res);
      if (res.data.isLogged === false) {
        return;
      } else {
      }
    });
    navigate("/");
  };

  const [startDate, setStartDate] = React.useState(new Date());
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };
  const [endDate, setEndDate] = React.useState(new Date());
  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  return (
    <>
      <Box>
        {/* Navbar */}
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
                Upload Tender
              </Typography>
              <IconButton
                edge="start"
                color="warning"
                aria-label="Logout"
                onClick={logout}
              >
                <Typography variant="caption" color="">
                  Logout&nbsp;
                </Typography>{" "}
                <LoginIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        {/* Body */}

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Add New Tender */}
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 170,
                  backgroundColor: "#D4F1F4",
                }}
              >
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={11}>
                    <TextField
                      sx={{ ml: "2rem", width: "40vw" }}
                      name="tenderName"
                      variant="outlined"
                      value={values.tenderName}
                      onChange={handleInputChange}
                    />
                    <TextField
                      sx={{ ml: "2rem", width: "30vw" }}
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      label="Minimum Tender Amount"
                      name="minTenderAmount"
                      variant="outlined"
                      value={values.minTenderAmount}
                      onChange={handleInputChange}
                    />
                    <br></br>
                    <br></br>
                    <br></br>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-evenly"
                    >
                      <Button
                        component="label"
                        startIcon={<UploadFileRoundedIcon />}
                        variant="contained"
                        sx={{ width: "10vw" }}
                      >
                        File (.pdf)
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          hidden
                          accept="application/pdf"
                        />
                      </Button>

                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                          label="Start Date"
                          // minDate={new Date()}
                          value={startDate}
                          onChange={handleStartDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        sx={{}}
                      >
                        <DateTimePicker
                          label="End Date"
                          // minDate={new Date()}
                          value={endDate}
                          onChange={handleEndDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <Button
                        type="submit"
                        startIcon={<CheckBoxRoundedIcon />}
                        variant="contained"
                        color="success"
                        sx={{ width: "10vw" }}
                      >
                        Save
                      </Button>
                    </Stack>
                    <br></br>
                    <br></br>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/* --------------------------------------------------------- */}

            {/* Display existing tenders */}
            <AdminCardComponent data={data} />
            {/* --------------------------------------------------------- */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminUploadTender;
