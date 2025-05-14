// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Allow CORS from your frontend (adjust URL if necessary)
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Update with your frontend's URL if different
  })
);

// Your Fitbit API Access Token (replace with actual token)
const FITBIT_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FITlgiLCJzdWIiOiJDTFo4WFQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByaXJuIHJveHkgcm51dCBycHJvIHJzbGUgcmNmIHJhY3QgcnJlcyBybG9jIHJ3ZWkgcmhyIHJ0ZW0iLCJleHAiOjE3NDcyNjQyODAsImlhdCI6MTc0NzIzNTQ4MH0.WT1nWy5MPFDpqhn-rEdODkHKCuzJNR2KIbt4hMlEUTs";

// Route to fetch profile from Fitbit
app.get("/fitbit-profile", async (req, res) => {
  try {
    const response = await axios.get("https://api.fitbit.com/1/user/-/profile.json", {
      headers: {
        Authorization: `Bearer ${FITBIT_ACCESS_TOKEN}`,
      },
    });

    // Send the profile data back to your frontend
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching Fitbit data:", err);
    res.status(500).json({ error: "Error fetching Fitbit data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Fitbit API proxy server running at http://localhost:${PORT}`);
});
