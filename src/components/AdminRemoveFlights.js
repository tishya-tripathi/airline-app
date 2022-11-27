import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useNavigate } from "react-router-dom";
import { PDFLib, PDFDocument, StandardFonts, rgb } from "pdf-lib";

const AdminRemoveFlight = () => {
  const tenderName = window.sessionStorage.getItem("tenderName");

  const navigate = useNavigate();

  const logout = () => {
    axios({
      url: "https://murudeshwar.org/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      // console.log(res)
    });
    navigate("/");
  };

  const [rows, setRows] = React.useState([]); //{id: 10, vendorName: "Ramesh Kumar", orgName: "Ventura LLC", phone: "9123871232", tenderValue: "150750" }


  const columns = [
    {
      field: "id",
      headerName: "Flight No",
      flex: 1,
      maxWidth: 200,
    },
    {
      field: "flightName",
      headerName: "Flight Name",
      flex: 1,
      maxWidth: 200,
    },
    {
      field: "Button",
      flex: 1,
      maxWidth: 100,
      renderCell: (params) => {
        return (
          <Box textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                console.log("Delete flight")
              }}
            >
              <DownloadRoundedIcon />
            </Button>
          </Box>
        );
      },
    },

  ];

  React.useEffect(() => {
    axios({
      url: "https://murudeshwar.org/all_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      // console.log(res);
      const data = [];
      console.log("New res data: ", res);
      let cnt = 1;
      for (var i = 0; i < res.data.length; i++) {
        if (
          res.data[i].tenderName === tenderName &&
          res.data[i].stud.length !== 0
        ) {
          var obj = {
            id: cnt++,
            vendorName: res.data[i].stud[0].profile.name,
            orgName: res.data[i].stud[0].profile.organization,
            phone: res.data[i].stud[0].profile.phoneno,
            tenderValue: res.data[i].tenderValue,
            urlEmd:
              "https://murudeshwar.org/" +
              res.data[i].profile.edm.path.toString(),
            urlAadhar:
              "https://murudeshwar.org/" +
              res.data[i].profile.aadhar.path.toString(),
            urlPan:
              "https://murudeshwar.org/" +
              res.data[i].profile.pan.path.toString(),
            withdraw: res.data[i].withdraw,
            emdNum: res.data[i].emdNumber,
            email: res.data[i].email,
          };
          if (obj.withdraw === 0) obj.withdraw = "";
          if (obj.withdraw === 1) obj.withdraw = "YES.";
          data.push(obj);
        }
      }
      setRows(data);
      // console.log(rows);
    });
  }, []);

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
                Remove Flights
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
            <Grid item xs={12} md={12} lg={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "68vh",
                  backgroundColor: "#D4F1F4",
                }}
              >
                <Typography
                  variant="h5"
                  color="text.primary"
                  sx={{ ml: 2, fontWeight: "bold" }}
                >
                  {tenderName}
                </Typography>
                <br />
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "55vh",
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    components={{
                      Toolbar: GridToolbar,
                    }}
                  />
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AdminRemoveFlight;
