import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Avatar,
  Button,
  Typography,
} from "@mui/material"; // Updated import
import { TfiEmail } from "react-icons/tfi";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { tabTitle } from "../App";
import "./InstructionPage.css"; // Import the CSS file

const Otpverification = () => {
  tabTitle("OTP Page | Cervical Cancer Prediction");
  const avatarStyle = { backgroundColor: "#6a7ccc", fontSize: 30 };
  const btnstyle = {
    marginTop: "28px ",
    backgroundColor: "#ff33b8 ",
    color: "white",
  };

  const navigate = useNavigate();
  const [otpnum, setOtpnum] = useState("");

  const location = useLocation();
  const EmailAddress = location.state && location.state.email;

  const handleChange = (newValue) => {
    setOtpnum(newValue);
  };

  const NewOtp = (e) => {
    e.preventDefault();

    // Ensure OTP is a string and Email is properly set
    let request = {
      Email: EmailAddress,
      OTP: otpnum.trim(),  // Send OTP as a string, trim any spaces
    };

    console.log("data", request);

    if (counter === 0) {
      toast.warning("Please Resend OTP");
      console.log("resend otp");
    } else if (!request.OTP) {
      toast.warning("Please enter OTP");
    } else {
      axios
        .post("http://127.0.0.1:5000/verifyotp", request)
        .then((response) => {
          console.log("API response:", response);
          if (response.status === 200) {
            console.log("Success");
            toast.success("Verified successfully!");
          }
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          console.error("API error:", error);
          if (error.response && error.response.status === 400) {
            toast.error("Invalid OTP");
            console.log("Invalid");
          } else {
            console.log("Other error occurred");
          }
        });
    }
  };

  const resendOtp = () => {
    let request = {
      Email: EmailAddress,
    };

    if (counter === 1) {
      toast.warning("Please wait before resending OTP");
    } else {
      axios
        .post("http://127.0.0.1:5000/resendotp", request)
        .then((response) => {
          console.log("API response:", response);
          toast.success("OTP resent successfully!");
        })
        .catch((error) => {
          console.error("API error:", error);
          if (error.response && error.response.status === 400) {
            // toast.error("Invalid OTP");
            console.log("Invalid");
          } else {
            console.log("resend Other error occurred");
            toast.error("Failed to resend OTP");
          }
        });
    }
  };

  const [counter, setCounter] = useState(120);
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <form>
      <ToastContainer position="top-center" />
      <Grid className="mainbody">
        <Paper elevation={20} className="secondbody">
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <TfiEmail />
            </Avatar>
            <h4 style={{ color: "blue", paddingTop: 15 }}>Email</h4>
            <Box color="text.primary">
              <Typography variant="body1">
                We just sent your authentication code via email to
                <b> {EmailAddress ? EmailAddress : "your email"} </b>
              </Typography>
            </Box>
          </Grid>
          <br />

          <MuiOtpInput
            className="box"
            length={6}
            gap={1.5}
            value={otpnum}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            style={btnstyle}
            onClick={NewOtp}
            fullWidth
          >
            VERIFY
          </Button>

          <Box mt={3}>
            <Typography fontWeight={500} align="center" color="textSecondary">
              The code will expire in{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                00:{counter}
              </span>{" "}
            </Typography>
          </Box>

          <Typography
            align="center"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Button
              onClick={(event) => {
                setCounter(120);
                event.preventDefault();
                resendOtp();
              }}
            >
              <span style={{ color: "red" }}>Resend OTP</span>
            </Button>

            <Button
              onClick={() => {
                navigate("/register");
              }}
            >
              <span style={{ color: "red" }}>back</span>
            </Button>
          </Typography>
        </Paper>
      </Grid>
    </form>
  );
};

export default Otpverification;
