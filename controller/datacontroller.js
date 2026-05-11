import express from "express";
import axios from "axios";
import "dotenv/config";

const apiKey = process.env.OPENWEATHER_API_KEY;
const BASE_URL = `https://api.openweathermap.org/data/2.5`;

export const getCity = async (req, res) => {
  const { city, lat, lon, pincode } = req.query;
  console.log("city: " + city, "lat: " + lat, "lon: " + lon);

  try {
    let response;
    if (pincode) {
      const geoRes = await axios.get(
        `http://api.openweathermap.org/geo/1.0/zip`,
        {
          params: { zip: pincode, appid: apiKey },
        },
      );
      const { lat: pLat, lon: pLon } = geoRes;
      response = await axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, units: "metric", appid: apiKey },
      });
    }
    if (city && city !== "null" && city !== "undefined") {
      response = await axios.get(`${BASE_URL}/weather`, {
        params: { q: `${city},IN`, units: "metric", appid: apiKey },
      });
    } else if (lat && lon) {
      response = await axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, units: "metric", appid: apiKey },
      });
    } else {
      return res.status(400).json({ message: "No location data provided" });
    }
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error("city not found", error.message, city);
    if (error.response) {
      return res.status(error.response.status).json({
        msg:
          error.response.data.message ||
          "Error fetching city weather from provider",
      });
    }

    res.status(500).json({
      err: error,
      msg: "Internal server error while fetching weather.",
    });
  }
};
