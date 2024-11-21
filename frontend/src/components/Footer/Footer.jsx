import React from "react";
import { Box, Stack, styled, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  const FooterContainer = styled(Box)(({ theme }) => ({
    backgroundColor: "#1c2859",
    color: "#fff",
    padding: "2rem 1rem",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  }));

  const LinksContainer = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: "1rem",
    },
  }));

  const SocialIcons = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem",
    "& a": {
      color: "#fff",
      transition: "color 0.3s ease",
      "&:hover": {
        color: "#d6456e",
      },
    },
  }));

  return (
    <FooterContainer component="footer">
      <LinksContainer>
        <Link
          href="/"
          underline="none"
          sx={{
            color: "#fff",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Home
        </Link>
        <Link
          href="/symptoms"
          underline="none"
          sx={{
            color: "#fff",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Symptoms
        </Link>
        <Link
          href="/contact"
          underline="none"
          sx={{
            color: "#fff",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Contact
        </Link>
        <Link
          href="/FAQs"
          underline="none"
          sx={{
            color: "#fff",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          FAQs
        </Link>
        <Link
          href="/login"
          underline="none"
          sx={{
            color: "#fff",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Signin
        </Link>
      </LinksContainer>
      <SocialIcons>
        <Link href="#" aria-label="Instagram">
          <InstagramIcon />
        </Link>
        <Link href="#" aria-label="Facebook">
          <FacebookIcon />
        </Link>
        <Link href="#" aria-label="LinkedIn">
          <LinkedInIcon />
        </Link>
      </SocialIcons>
      <Typography variant="caption" component="p" sx={{ textAlign: "center", marginTop: "1rem" }}>
        Copyright © 2024 Naisimoi. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
