import * as React from "react";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import VendorCardComponent from "./VendorCardComponent";
import Paper from "@mui/material/Paper";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Button from "@mui/material/Button";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { ToWords } from "to-words";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import "./Styles.css";
import { useConfirm } from "material-ui-confirm";
import { PDFLib, PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Used for snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VendorTenderDetails = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  //  To Words package config
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  const [disp1, setDisp1] = React.useState(false); // View Amount toggle display
  const [disp2, setDisp2] = React.useState(true); // Edit Amount toggle display

  const [disp3, setDisp3] = React.useState(false); // View EMD Num toggle display
  const [disp4, setDisp4] = React.useState(true); // Edit EMD Num toggle display

  const [firstClick, setFirstClick] = React.useState(true);
  //---------------------------

  const [selectedFile1, setSelectedFile1] = React.useState(null);
  const [selectedFile2, setSelectedFile2] = React.useState(null);
  const [selectedFile3, setSelectedFile3] = React.useState(null);

  const [urlFile1, setURLFile1] = React.useState(null);
  const [urlFile2, setURLFile2] = React.useState(null);
  const [urlFile3, setURLFile3] = React.useState(null);

  const [existing_val, set_existing_val] = React.useState("0.00");
  const [existing_emdNumber, set_existing_emdNumber] = React.useState("---");

  const [email, setEmail] = React.useState(
    window.sessionStorage.getItem("userEmail")
  );
  const [val, setVal] = React.useState({
    tender_name: window.sessionStorage.getItem("tender_name"),
    end_date: window.sessionStorage.getItem("end_date"),
    tender_val: "",
    tender_val_words: "",
    emd_num: "",
  });

  const handleValueChange = (e) => {
    // --------handleChange----------
    const { name, value } = e.target;
    setVal((prevState) => ({
      ...prevState,
      [name]: value,
      ["tender_val_words"]: toWords.convert(Number(value), {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    }));
  };

  const handleValueChangeEMD = (e) => {
    const { name, value } = e.target;
    setVal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // -----------------------------------
  };

  const [hrefEMD, sethrefEMD] = React.useState();
  const [hrefAADHAR, sethrefAADHAR] = React.useState();
  const [hrefPAN, sethrefPAN] = React.useState();

  const [isWithdrawn, setIsWithdrawn] = React.useState();
  const [existingTender, setExistingTender] = React.useState("");
  React.useEffect(() => {
    // 1. Check if Vendor has an existing tender
    axios({
      url: "https://murudeshwar.org/all_data",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        if (
          res.data[i].tenderName ==
            window.sessionStorage.getItem("tender_name") &&
          res.data[i].profile.email == email
        ) {
          // existing tender - TRUE.  Store tenderVal in existing tender
          console.log("existing tender - TRUE" + existingTender);
          setExistingTender(res.data[i].tenderValue);

          // set existing_val and existing_emdNumber
          if (res.data[i].tenderValue !== "" && res.data[i].withdraw === "") {
            set_existing_val(res.data[i].tenderValue);
            set_existing_emdNumber(res.data[i].emdNumber);
          }

          // Set download links of EMD, PAN, AADHAR to state variables
          sethrefEMD(
            "https://murudeshwar.org/" + res.data[i].profile.edm.path.toString()
          );
          sethrefAADHAR(
            "https://murudeshwar.org/" +
              res.data[i].profile.aadhar.path.toString()
          );
          sethrefPAN(
            "https://murudeshwar.org/" + res.data[i].profile.pan.path.toString()
          );

          // Set isWithdrawn
          setIsWithdrawn(res.data[i].withdraw);

          // Set disp2 i.e. EDIT AMOUNT to false
          setDisp2(false);
          setDisp4(false);

          break;
        }
      }
    });
  }, []);

  const withdrawTender = async () => {
    if (firstClick === false) return;

    setFirstClick(false);

    if (window.confirm("Do you really want to withdraw your tender?")) {
      console.log("Withdrawing Tender :", val.tender_name, email);

      // set Withdrawn field to TRUE
      await axios({
        url: "https://murudeshwar.org/update_withdraw",
        method: "POST",
        withCredentials: true,
        crossDomain: true,
        data: { tenderName: val.tender_name, email: email, withdraw: "YES." },
      }).then((res) => {
        console.log("Tender withdrawn successfully. ", res);
        setOpen3(true);
        setTimeout(function () {
          navigate("/vendor/uploadtender");
        }, 1000);
      });
    } else {
      setFirstClick(true);
    }
    return;
  };

  const hasApplied = () => {
    if (existingTender !== "" && !isWithdrawn) {
      return (
        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Alert
              severity="error"
              sx={{ padding: "1rem", justifyContent: "center" }}
            >
              <strong>
                You have already submitted. &nbsp;If you re-submit, your
                existing tender details will be updated.
              </strong>
            </Alert>
          </Grid>
        </>
      );
    } else if (existingTender !== "" && isWithdrawn) {
      return (
        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Alert
              severity="success"
              sx={{ padding: "1rem", justifyContent: "center" }}
            >
              <strong>
                Tender withdrawn. You can submit a new Tender now.
              </strong>
            </Alert>
          </Grid>
        </>
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (firstClick === false) return;

    setFirstClick(false);

    const formData = new FormData(); //      (event.currentTarget)
    formData.append("emd", selectedFile1);
    formData.append("aadhar", selectedFile2);
    formData.append("pan", selectedFile3);

    const newTender = {
      // File Upload
      emdNumber: val.emd_num,
      tenderName: val.tender_name,
      tenderValue: val.tender_val,
      email: email,
      endDate: window.sessionStorage.getItem("actual_end_date"),
      amountWords: val.tender_val_words,
      edm: formData.get("emd"),
      pan: formData.get("pan"),
      aadhar: formData.get("aadhar"),
      withdraw: null, //      set Withdrawn field
    };
    console.log("New Tender : ", newTender);

    // *****************CASE 1 : First Tender Upload*************************

    if (existingTender === "" && !isWithdrawn) {
      if (newTender.tenderValue === "") {
        setDisp2(true);
        window.alert("Tender value cannot be empty!");
        setFirstClick(true);
        return;
      } else if (newTender.emdNumber === "") {
        setDisp4(true);
        window.alert("EMD No cannot be empty!");
        setFirstClick(true);
        return;
      } else if (
        newTender.edm === "null" ||
        newTender.pan === "null" ||
        newTender.aadhar === "null"
      ) {
        window.alert("EMD, PAN and AADHAR file upload is mandatory!");
        setFirstClick(true);
        return;
      } else {
        console.log("CASE 1 : First Tender Upload ");

        // Add Acknowledge Button
        console.log("Making PDF");
        await makePDF(
          newTender.tenderValue,
          newTender.emdNumber,
          urlFile1,
          urlFile2,
          urlFile3
        );

        confirm({
          description:
            "Please review the downloaded Tender Application. Then click 'OK' to submit.\nThe Application will be sent to your EMail address as well (Check Inbox & Spam folder).",
        })
          .then(async () => {
            // User clicked OK
            setOpen4(true);
            // AXIOS Connection -  Upload New Tender
            try {
              const response = await axios({
                method: "post",
                url: "https://murudeshwar.org/upload_file",
                data: newTender,
                headers: { "Content-Type": "multipart/form-data" },
              });
              console.log("Success! Tender Uploaded. Case 1.\n");
              setOpen(true);

              setTimeout(function () {
                navigate("/vendor/uploadtender");
              }, 1000);
              return;
            } catch (error) {
              console.log("Error. Tender not Uploaded! Case 1.\n", error);
              window.location.reload();
              return;
            }
          })
          .catch(() => {
            // User clicked CANCEL or clickaway
            setFirstClick(true);
            return;
          });
      }
      return;
    }

    // *****************CASE 2 : Editing after First Upload*************************
    if (existingTender !== "" && !isWithdrawn) {
      console.log("CASE 2 : Editing after First Upload");

      // make PDF
      var updt_value, updt_emdnum, updt_url1, updt_url2, updt_url3;
      if (newTender.edm !== "null") updt_url1 = urlFile1;
      else updt_url1 = hrefEMD;
      if (newTender.aadhar !== "null") updt_url2 = urlFile2;
      else updt_url2 = hrefAADHAR;
      if (newTender.pan !== "null") updt_url3 = urlFile3;
      else updt_url3 = hrefPAN;
      if (
        newTender.emdNumber !== "null" &&
        newTender.emdNumber.toString().length > 0
      )
        updt_emdnum = newTender.emdNumber;
      else updt_emdnum = existing_emdNumber;
      if (newTender.tenderValue !== "null" && Number(newTender.tenderValue) > 0)
        updt_value = newTender.tenderValue;
      else updt_value = existing_val;

      await makePDF(updt_value, updt_emdnum, updt_url1, updt_url2, updt_url3);

      // Throw confirmation box to user
      confirm({
        description:
          "Please review the downloaded Tender Application. Then click 'OK' to submit.\nThe Application will be sent to your EMail address as well (Check Inbox & Spam folder).",
      })
        .then(async () => {
          // User clicks OK
          setOpen4(true);
          // ----------------------------------------
          // EDM File edited
          if (newTender.edm !== "null") {
            console.log("EDM File edited");
            await axios({
              url: "https://murudeshwar.org/upload_edm",
              method: "POST",
              data: {
                tenderName: val.tender_name,
                email: email,
                EDM_file: formData.get("emd"),
              },
              headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => {
              console.log("EDM File updated successfully", res);
            });
          }

          // AADHAR File edited
          if (newTender.aadhar !== "null") {
            console.log("AADHAR File edited");
            await axios({
              url: "https://murudeshwar.org/upload_aadhar",
              method: "POST",
              data: {
                tenderName: val.tender_name,
                email: email,
                aadhar_file: formData.get("aadhar"),
              },
              headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => {
              console.log("Aadhar File updated successfully", res);
            });
          }

          // PAN File edited
          if (newTender.pan !== "null") {
            console.log("PAN File edited");
            await axios({
              url: "https://murudeshwar.org/upload_pan",
              method: "POST",
              data: {
                tenderName: val.tender_name,
                email: email,
                PAN_file: formData.get("pan"),
              },
              headers: { "Content-Type": "multipart/form-data" },
            }).then((res) => {
              console.log("PAN File updated successfully", res);
            });
          }

          // EMD No Edited
          if (
            newTender.emdNumber !== "null" &&
            newTender.emdNumber.toString().length > 0
          ) {
            console.log("EMD No edited");
            await axios({
              url: "https://murudeshwar.org/update_emdNumber",
              method: "POST",
              withCredentials: true,
              crossDomain: true,
              data: {
                tenderName: newTender.tenderName,
                email: newTender.email,
                emdNumber: newTender.emdNumber,
              },
            }).then((res) => {
              console.log("emdNumber updated successfully ", res);
            });
          }

          // TenderValue edited
          if (
            newTender.tenderValue !== "null" &&
            Number(newTender.tenderValue) > 0
          ) {
            console.log("tenderValue edited");
            await axios({
              url: "https://murudeshwar.org/update_vender",
              method: "POST",
              withCredentials: true,
              crossDomain: true,
              data: {
                tenderName: newTender.tenderName,
                email: newTender.email,
                tenderValue: newTender.tenderValue,
              },
            }).then((res) => {
              console.log("tenderValue updated successfully ", res);
            });
          }

          setOpen2(true);
          setTimeout(function () {
            navigate("/vendor/uploadtender");
          }, 1000);
          return;
          // ----------------------------------------
        })
        .catch(() => {
          setFirstClick(true);
          return;
        });
    }

    // *****************CASE 3 : Second Tender Upload after Withdrawing*************************
    if (existingTender !== "" && isWithdrawn) {
      if (newTender.tenderValue === "") {
        setDisp2(true);
        window.alert("Tender value cannot be empty!");
        setFirstClick(true);
        return;
      } else if (newTender.emdNumber === "") {
        setDisp4(true);
        window.alert("EMD No cannot be empty!");
        setFirstClick(true);
        return;
      } else if (
        newTender.edm === "null" ||
        newTender.pan === "null" ||
        newTender.aadhar === "null"
      ) {
        window.alert("EMD, PAN and AADHAR file upload is mandatory!");
        setFirstClick(true);
        return;
      } else {
        console.log("CASE 3 : Second Tender Upload after Withdrawing");

        // make PDF
        await makePDF(
          newTender.tenderValue,
          newTender.emdNumber,
          urlFile1,
          urlFile2,
          urlFile3
        );

        confirm({
          description:
            "Please review the downloaded Tender Application. Then click 'OK' to submit.\nThe Application will be sent to your EMail address as well (Check Inbox & Spam folder).",
        })
          .then(async () => {
            // User clicked OK
            setOpen4(true);
            // Delete existing tender
            await axios
              .delete("https://murudeshwar.org/delete_tender_file", {
                data: {
                  tenderName: newTender.tenderName,
                  email: newTender.email,
                },
              })
              .then(async (res) => {
                console.log("Deleted existing tender");

                // upload new tender & set "withdrawn" to false
                newTender.withdraw = null;

                // AXIOS connection
                try {
                  const response = await axios({
                    method: "post",
                    url: "https://murudeshwar.org/upload_file",
                    data: newTender,
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  console.log("Success! Tender Uploaded. Case 3.\n");
                  setOpen(true);
                  setTimeout(function () {
                    navigate("/vendor/uploadtender");
                  }, 1000);
                  return;
                } catch (error) {
                  console.log("Error. Tender not Uploaded! Case 3.\n", error);
                  window.location.reload();
                  return;
                }
              });
          })
          .catch(() => {
            // User clicked CANCEL or clickaway
            setFirstClick(true);
            return;
          });
      }
      return;
    }
  };

  const displayViewEMDNumField = () => {
    if (disp3)
      return (
        <>
          <Grid item xs={4}>
            <TextField
              label="Existing EMD No."
              sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
              fullWidth
              value={existing_emdNumber}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </>
      );
    else
      return (
        <>
          <Grid item xs={4}></Grid>
        </>
      );
  };

  const displayEditEMDNumField = () => {
    if (disp4)
      return (
        <>
          <Grid item xs={4}>
            <TextField
              sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
              fullWidth
              label="Enter EMD No."
              name="emd_num"
              value={val.emd_num}
              onChange={handleValueChangeEMD}
              variant="outlined"
            />
          </Grid>
        </>
      );
    else
      return (
        <>
          <Grid item xs={4}></Grid>
        </>
      );
  };

  const displayViewAmountField = () => {
    if (disp1)
      return (
        <>
          <Grid item xs={4}>
            <TextField
              label="Existing Tender Amount"
              sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
              fullWidth
              value={existing_val}
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </>
      );
    else
      return (
        <>
          <Grid item xs={4}></Grid>
        </>
      );
  };

  const displayEditAmountField = () => {
    if (disp2)
      return (
        <>
          <Grid item xs={4}>
            <TextField
              type="number"
              onWheel={(e) => e.target.blur()}
              sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
              fullWidth
              label="Enter Tender Amount"
              name="tender_val"
              inputProps={{
                min: window.sessionStorage.getItem("min_tender_amount"),
              }}
              value={val.tender_val}
              onChange={handleValueChange}
              variant="outlined"
            />
          </Grid>
        </>
      );
    else
      return (
        <>
          <Grid item xs={4}></Grid>
        </>
      );
  };

  const handleFileSelect1 = (event) => {
    // console.log(event.target.files[0]);
    if (event.target.files[0].type != "application/pdf")
      window.location.reload();
    setSelectedFile1(event.target.files[0]);
    setURLFile1(URL.createObjectURL(event.target.files[0]));
  };
  const handleFileSelect2 = (event) => {
    if (event.target.files[0].type != "application/pdf")
      window.location.reload();
    setSelectedFile2(event.target.files[0]);
    setURLFile2(URL.createObjectURL(event.target.files[0]));
  };
  const handleFileSelect3 = (event) => {
    if (event.target.files[0].type != "application/pdf")
      window.location.reload();
    setSelectedFile3(event.target.files[0]);
    setURLFile3(URL.createObjectURL(event.target.files[0]));
  };

  // -----Opening and Closing snackbar-----
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [open4, setOpen4] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpen2(false);
    setOpen3(false);
    setOpen4(false);
  };
  // -----------------------------

  const makePDF = async (tendValue, emdNumb, url1, url2, url3) => {
    console.log(
      "Params: ",
      "\n",
      tendValue,
      "\n",
      emdNumb,
      "\n",
      url1,
      "\n",
      url2,
      "\n",
      url3
    );

    // PDF Creation
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const page = pdfDoc.addPage();

    const { width, height } = page.getSize();
    const fontSize = 15;

    // Add PDF Heading contents
    // page.drawText("MHATOBAR SHRI MURDESHWAR TEMPLE", {
    page.drawText("Sundarrameshwar Trust", {
      x: 160,
      y: height - 100,
      size: 24,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    page.drawText("MURDESHWAR – 581350 (N.K.) Karnataka", {
      x: 150,
      y: height - 125,
      size: 15,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    page.drawText("Tender Application", {
      x: 220,
      y: height - 160,
      size: 12,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });

    // ------------------------

    page.drawText(
      "Tender Name: " + window.sessionStorage.getItem("tender_name").toString(),
      {
        x: 100,
        y: height - 200 - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      "Vendor Name: " +
        window.sessionStorage.getItem("userVendorName").toString(),
      {
        x: 100,
        y: height - 240 - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      "Organisation Name: " +
        window.sessionStorage.getItem("userOrg").toString(),
      {
        x: 100,
        y: height - 280 - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      "Phone: " + window.sessionStorage.getItem("userPhone").toString(),
      {
        x: 100,
        y: height - 320 - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText(
      "EMail: " + window.sessionStorage.getItem("userEmail").toString(),
      {
        x: 100,
        y: height - 360 - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      }
    );
    page.drawText("Tender Value: " + tendValue.toString(), {
      x: 100,
      y: height - 400 - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText("UTI Number/ Transaction Number: " + emdNumb.toString(), {
      x: 100,
      y: height - 440 - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText("Applied on: " + Date().toString().slice(4, 15), {
      x: 100,
      y: height - 480 - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // --------------- Merging ------------------------
    const numDocs = 3;
    const urls = [url1, url2, url3];
    for (var i = 0; i < numDocs; i++) {
      const donorPdfBytes = await fetch(urls[i]).then((res) =>
        res.arrayBuffer()
      );

      const donorPdfDoc = await PDFDocument.load(donorPdfBytes, {
        ignoreEncryption: true,
      });

      const docLength = donorPdfDoc.getPageCount();
      for (var k = 0; k < docLength; k++) {
        const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
        pdfDoc.addPage(donorPage);
      }
    }
    // // ------------------------------------------------

    const file = await pdfDoc.save();

    // ----------- Trigger Download ------------------
    const blob = new Blob([file], { type: "application/pdf" });
    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement("a");
    link.style.display = "none";
    // link.target = "_blank"
    link.href = URL.createObjectURL(blob);
    link.download = "Vendor Application";

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();

    // ------------Sending Email-------------------
    // Convert blob--->base64
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async function () {
      var base64String = reader.result;
      // console.log("Base64 String - ", base64String);

      // ------------------------- EmailJS -----------------------------------

      // var templateParams = {
      //   vendor_email: email.toString()
      // };

      await window.emailjs
        .send(
          "service_d9uzoqn",
          "template_cmix3p1",
          {
            vendor_email: email.toString(),
            content: base64String,
          },
          "jVJiCS_0zN5eGjcJC"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
          },
          function (err) {
            console.log("FAILED...", err);
          }
        );

      // ----------------------------------------------------------------------

      // Send Email------------- smtpJS
      // console.log("Sending EMAIL!!!");
      // await window.Email.send({
      //   SecureToken : "e204d4c7-a86a-4548-8d57-cc70da753e55",
      //   To: email.toString(),
      //   From: "tender@murudeshwartempletender.com",
      //   Subject: "Murudeshwar Temple Tender Application",
      //   Body: "This is your Tender Application. Thank you!",
      //   Attachments: [
      //     {
      //       name: "VendorApplication.pdf",
      //       data: base64String,
      //     },
      //   ],
      // }).then((message) => console.log(message));
      // console.log("EMAIL Sent");
      // -----------------------------------------------
    };

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);
    }, 0);
    // ---------------------------------------------------
  };

  const logout = () => {
    axios({
      url: "https://murudeshwar.org/logout",
      method: "GET",
      withCredentials: true,
      crossDomain: true,
    }).then((res) => {
      //   console.log(res);
    });
    navigate("/");
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

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {hasApplied()}
          <Grid item xs={12}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                minHeight: "80vh", // Change this
                backgroundColor: "#D4F1F4",
              }}
            >
              <Typography variant="h4" color="text.primary" align="center">
                Tender Details
              </Typography>
              <br />
              <br />
              <Grid
                sx={{ paddingX: "1rem" }}
                container
                rowSpacing={2}
                // columnSpacing={{ xs: 1, sm: 2, md: 10 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Tender Name
                  </Typography>
                </Grid>
                <br />
                <br />
                {/* ----------------------------------------------- */}

                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={val.tender_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    End Date & Time
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    value={val.end_date}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    EMD File ( .pdf only )
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", maxWidth: "10rem" }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                  >
                    UPLOAD
                    <input
                      type="file"
                      onChange={handleFileSelect1}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <a
                    disabled={!existingTender || isWithdrawn}
                    href={hrefEMD}
                    target="_blank"
                    download
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      sx={{ marginX: "0.5rem", maxWidth: "10rem" }}
                      disabled={!existingTender || isWithdrawn}
                      fullWidth
                      component="label"
                      startIcon={<DownloadRoundedIcon />}
                      variant="contained"
                    >
                      View EMD
                    </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", maxWidth: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    Edit
                    <input
                      type="file"
                      onChange={handleFileSelect1}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile1} target="_blank">
                    {urlFile1 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    Aadhar ( .pdf only )
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      onChange={handleFileSelect2}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <a
                    disabled={!existingTender || isWithdrawn}
                    href={hrefAADHAR}
                    target="_blank"
                    download
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      sx={{ marginX: "0.5rem", width: "10rem" }}
                      disabled={!existingTender || isWithdrawn}
                      fullWidth
                      component="label"
                      startIcon={<DownloadRoundedIcon />}
                      variant="contained"
                    >
                      View Aadhar
                    </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    EDIT
                    <input
                      type="file"
                      onChange={handleFileSelect2}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile2} target="_blank">
                    {urlFile2 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={3}>
                  <Typography variant="overline" color="text.primary">
                    PAN ( .pdf only )
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={existingTender && !isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                    onChange={() => {
                      //   uploadFile(data.tenderName);    //  Upload File Handler
                    }}
                  >
                    Upload
                    <input
                      type="file"
                      onChange={handleFileSelect3}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                <Grid item xs={3}>
                  <a
                    disabled={!existingTender || isWithdrawn}
                    href={hrefPAN}
                    target="_blank"
                    download
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      sx={{ marginX: "0.5rem", width: "10rem" }}
                      disabled={!existingTender || isWithdrawn}
                      fullWidth
                      component="label"
                      startIcon={<DownloadRoundedIcon />}
                      variant="contained"
                    >
                      View PAN
                    </Button>
                  </a>
                </Grid>

                <Grid item xs={3}>
                  <Button
                    sx={{ marginX: "0.5rem", width: "10rem" }}
                    disabled={!existingTender || isWithdrawn}
                    fullWidth
                    component="label"
                    startIcon={<EditRoundedIcon />}
                    variant="contained"
                  >
                    EDIT
                    <input
                      type="file"
                      onChange={handleFileSelect3}
                      hidden
                      accept="application/pdf"
                    />
                  </Button>
                </Grid>

                {/* ----------------------------------------------- */}

                <Grid item xs={4}></Grid>
                <Grid item xs={8}>
                  <a href={urlFile3} target="_blank">
                    {urlFile3 && "View Uploaded File"}
                  </a>
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    EMD Number ( UTI Number )
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Button
                    disabled={existingTender === "" && !isWithdrawn}
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    component="label"
                    variant="contained"
                    onClick={() => {
                      disp3 ? setDisp3(false) : setDisp3(true);
                    }}
                  >
                    View EMD No
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled={existingTender === "" && !isWithdrawn}
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    component="label"
                    variant="contained"
                    onClick={() => {
                      disp4 ? setDisp4(false) : setDisp4(true);
                    }}
                  >
                    Edit EMD No
                  </Button>
                </Grid>

                {/* --------------------------------------------------- */}

                <Grid item xs={4}></Grid>

                {displayViewEMDNumField()}
                {displayEditEMDNumField()}

                {/* ---------------------HERE-------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Tender Amount ( Per Year )
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled={existingTender === "" && !isWithdrawn}
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    component="label"
                    variant="contained"
                    onClick={() => {
                      disp1 ? setDisp1(false) : setDisp1(true);
                    }}
                  >
                    View Amount
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    disabled={existingTender === "" && !isWithdrawn}
                    sx={{ marginX: "0.5rem", maxWidth: "20rem" }}
                    fullWidth
                    component="label"
                    // startIcon={<EditRoundedIcon />}
                    variant="contained"
                    onClick={() => {
                      disp2 ? setDisp2(false) : setDisp2(true);
                    }}
                  >
                    Edit Amount
                  </Button>
                </Grid>

                {/* --------------------------------------------------- */}

                <Grid item xs={4}></Grid>

                {displayViewAmountField()}

                {displayEditAmountField()}

                {/* ----------------------------------------------- */}

                <Grid item xs={4}>
                  <Typography variant="overline" color="text.primary">
                    Amount (in words)
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="tender_val_words"
                    value={val.tender_val_words}
                    multiline="true"
                    // onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* ----------------------------------------------- */}

                <Grid item xl={2}>
                  {existingTender && !isWithdrawn && (
                    <Button
                      fullWidth
                      color="error"
                      startIcon={<DeleteForeverIcon />}
                      variant="contained"
                      sx={{ height: "7vh", width: "10vw", marginX: "auto" }}
                      onClick={() => {
                        withdrawTender();
                      }}
                    >
                      Withdraw
                    </Button>
                  )}
                </Grid>
                <Grid item xl={2}></Grid>

                <Grid item xl={2}>
                  <Button
                    type="submit"
                    // startIcon={<CheckBoxRoundedIcon />}
                    variant="contained"
                    color="success"
                    sx={{
                      height: "7vh",
                      width: "10vw",
                      marginX: "auto",
                      marginY: "1rem",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>
      </Box>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Bid Successfully Submitted.
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Bid Updated Successfully.
        </Alert>
      </Snackbar>
      <Snackbar open={open3} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Bid Withdrawn Successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={open4}
        autoHideDuration={30000}
        onClose={handleClose}
        sx={{ marginBottom: "4rem" }}
      >
        <Alert onClose={handleClose} severity="primary" sx={{ width: "100%" }}>
          Processing...
        </Alert>
      </Snackbar>
    </>
  );
};

export default VendorTenderDetails;
