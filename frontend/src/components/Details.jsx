import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import Title from "./Title";
import Paragraph from "./Paragraph";

const Details = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      phone: data.get("phone"),
    });
  };

  return (
    <Stack
      component="section"
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        py: 10,
        px: 2,
        backgroundColor: "#f7f9fc", // Light blue-gray background
        minHeight: "100vh", // Ensures full-screen height
      }}
    >
      <Box
        sx={{
          width: "65%",
          maxWidth: "500px",
          padding: "30px 20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow
          textAlign: "center",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.02)", // Slight hover effect
          },
        }}
      >
        <Title
          text={"Contact Us"}
          sx={{
            fontSize: "2rem",
            color: "#344767",
            marginBottom: "20px",
          }}
        />
        <Paragraph
          text={"Fill up this form to get a call back from our Doctor."}
          sx={{
            fontSize: "1.1rem",
            color: "#555",
            marginBottom: "30px",
          }}
        />

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
              "& .MuiInputBase-root": {
                height: "40px", // Reduced height
              },
            }}
          />
          <TextField
            required
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number"
            type="phone"
            autoComplete="tel"
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
              "& .MuiInputBase-root": {
                height: "40px", // Reduced height
              },
            }}
          />
          <TextField
            placeholder="Write your problem here..."
            multiline
            fullWidth
            rows={3}
            maxRows={5}
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "5px",
            }}
          />
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              fontSize: "0.9rem",
              textTransform: "capitalize",
              py: 2,
              borderRadius: "5px",
              backgroundColor: "#5b7fc2",
              "&:hover": {
                backgroundColor: "#486aa8",
              },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default Details;
