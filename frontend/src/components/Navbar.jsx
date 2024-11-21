import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  List,
  ListItem,
  Typography,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import DrawerItem from "./DrawerItem";

const itemList = [
  { text: "Home", to: "/" },
  { text: "Symptoms", to: "/symptoms" },
  { text: "Contact", to: "/contact" },
  { text: "FAQs", to: "/FAQs" },
  { text: "Sign In", to: "/login" },
];

const Navbar = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffc1e3", // Light pink
        color: "#000", // Black text
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        padding: "0 10px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo and Title */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/cancerlogo.png"}
            alt="Cancer Prediction Logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%", // Circular logo
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1e2a5a", // Deep blue
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Cerv Care
          </Typography>
        </Link>

        {/* Drawer for Mobile */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <DrawerItem />
        </Box>

        {/* Menu for Larger Screens */}
        <List
          sx={{
            display: { xs: "none", sm: "flex" },
            padding: 0,
            gap: "20px",
          }}
        >
          {itemList.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                width: "auto",
              }}
            >
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  color: "#1e2a5a",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  "&:hover": {
                    color: "#ff4081", // Highlighted pink
                    backgroundColor: "transparent", // No background
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    textAlign: "center",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
