import React, { useState } from "react";
import "./InstructionPage.css"; // Ensure consistent global styles if needed
import {
  Box,
  Button,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CancerInfo from "./CancerInfo";
import LoadingScreen from "../LoadingScreen";
import axios from "axios";

const InstructionPage = ({ user_firstname, user_lastname }) => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setUploading(true);
    setPercentage(0);

    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);

    axios
      .post("http://127.0.0.1:5000/modelpredict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPercentage(percentage);
        },
      })
      .then(({ data }) => {
        setInfo(data.prediction);
        setImage(data.file);
        setLoading(false);
      })
      .catch((err) => console.error("Upload error:", err))
      .finally(() => {
        setImage(null);
        setUploading(false);
      });
  };

  const handleClear = () => {
    setInfo("");
    setImage(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f8f9fa",
        padding: "2rem",
        borderRadius: "8px",
        maxWidth: "800px",
        margin: "2rem auto",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button
        sx={{
          backgroundColor: "#d6456e",
          color: "#fff",
          float: "right",
          "&:hover": { backgroundColor: "#b53756" },
        }}
        startIcon={<BackspaceIcon />}
        href="/login"
      >
        Log out
      </Button>

      {/* Personalized Greeting */}
      <Typography variant="h4" sx={{ color: "#1c2859", marginBottom: 2 }}>
        Welcome, {user_firstname && user_lastname ? `${user_firstname} ${user_lastname}` : "Guest"}!

      </Typography>

      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Instructions for Cervical Cancer Prediction
      </Typography>

      <Typography
        sx={{
          backgroundColor: "#fee2e2",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: 3,
          color: "#d6456e",
        }}
      >
        <strong>Note:</strong> You can only upload <b>one image</b> at a time. Follow these steps:
      </Typography>

      <ol style={{ marginBottom: "2rem", color: "#333" }}>
        <li>Upload an image of the cervical region using the form below.</li>
        <li>Wait for the system to process and provide prediction results.</li>
      </ol>

      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" color="primary">
          Upload an Image for Classification
        </Typography>

        {uploading && (
          <>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{ width: "100%", height: "8px", borderRadius: "4px" }}
            />
            <Typography>{percentage}% Uploaded</Typography>
          </>
        )}

        {!uploading && (
          <>
            <CloudUploadIcon
              sx={{
                fontSize: "80px",
                color: "rgba(0, 0, 0, 0.2)",
              }}
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span" color="primary">
                Choose Image
              </Button>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            )}
          </>
        )}

        <Button
          variant="contained"
          color="success"
          disabled={!image || uploading}
          onClick={handleClick}
        >
          Upload
        </Button>
      </Stack>

      <Box
        sx={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "8px",
          backgroundColor: "#e0f7fa",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#2157f2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1b4bca" },
            float: "right",
          }}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Typography variant="h5" sx={{ color: "#1c2859", marginBottom: 2 }}>
          Prediction Results
        </Typography>
        <CancerInfo className={info} />
      </Box>

      {loading && <LoadingScreen />}
    </Box>
  );
};

export default InstructionPage;
