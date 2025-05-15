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
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FIUDYiLCJzdWIiOiJDTFo4WFQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd2VjZyB3c29jIHdhY3Qgd294eSB3dGVtIHd3ZWkgd2lybiB3Y2Ygd3NldCB3bG9jIHdyZXMiLCJleHAiOjE3NDczNDQ5ODEsImlhdCI6MTc0NzMxNjE4MX0.fwOgOqTMgts6zk5DrRuUQcBmggVsf99Dy1xtbmLnvkg";

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

// Route to fetch heart rate data from Fitbit
app.get("/fitbit-heart", async (req, res) => {
  const { date, startTime, endTime } = req.query;

  const useDate = date || new Date().toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `https://api.fitbit.com/1/user/-/activities/heart/date/${useDate}/${useDate}/1sec/time/${startTime}/${endTime}.json`,
      {
        headers: {
          Authorization: `Bearer ${FITBIT_ACCESS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching heart rate data:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch heart rate data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Fitbit API proxy server is running at http://localhost:${PORT}`);
});
