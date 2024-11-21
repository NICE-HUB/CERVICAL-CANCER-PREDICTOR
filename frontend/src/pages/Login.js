import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Stack, TextField } from "@mui/material";
import Title from "../components/Title";
import { useNavigate, NavLink } from "react-router-dom";
import { tabTitle } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../LoadingScreen.js";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = ({ setUserState }) => {
  tabTitle("Login | Cervical Cancer Awareness");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Track error messages
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      setLoading(true);
      setError(null); // Clear previous errors
      let user = {
        Email: values.email,
        Password: values.password,
      };

      axios.post("http://127.0.0.1:5000/login", {
        Email: values.email,
        Password: values.password,
    })
        .then((res) => {
          toast.success(res.data.message);
          let user = {
            FirstName: res.data.FirstName,
            LastName: res.data.LastName,
          };
          setUserState(user);

          setTimeout(() => {
            navigate("/InstructionPage", { replace: true });
          }, 2000);
        })
        .catch((err) => {
          setError(err.response?.data?.error || "An error occurred");
          toast.error(err.response?.data?.error || "Login failed");
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <Stack
      component="section"
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        py: 10,
        px: 2,
      }}
    >
      <Title text={"Login"} textAlign={"center"} />
      <ToastContainer position="top-center" />
      <Box
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
        sx={{
          mt: 1,
          py: 2,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          name="email"
          placeholder="Email Address"
          label="Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          name="password"
          placeholder="Password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        {error && (
          <Box sx={{ color: "red", marginBottom: 2 }}>
            <strong>{error}</strong>
          </Box>
        )}
        <Button
          variant="contained"
          fullWidth
          type="submit"
          size="medium"
          disabled={loading} // Disable button while loading
          sx={{
            fontSize: "0.9rem",
            textTransform: "capitalize",
            py: 2,
            mt: 3,
            mb: 2,
            borderRadius: 0,
            backgroundColor: "#14192d",
            "&:hover": {
              backgroundColor: "#1e2a5a",
            },
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
        <NavLink to="/register">Not registered yet? Register Now</NavLink>
      </Box>
      {loading && <LoadingScreen />}
    </Stack>
  );
};

export default Login;
