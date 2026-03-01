import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetailsPage.css";

const ALL_POLLUTANTS = [
  "PM2.5",
  "PM10",
  "NO2",
  "SO2",
  "CO",
  "OZONE",
  "NH3"
];

function getAirExplanation(value) {
  if (value <= 50)
    return {
      status: "Good",
      color: "#22c55e",
      message:
        "Air quality is satisfactory. Pollution level is low and safe for outdoor activities."
    };

  if (value <= 100)
    return {
      status: "Moderate",
      color: "#eab308",
      message:
        "Air quality is acceptable. Sensitive individuals may experience minor breathing discomfort."
    };

  if (value <= 200)
    return {
      status: "Unhealthy",
      color: "#f97316",
      message:
        "Air pollution may cause breathing discomfort to children, elderly, and asthma patients."
    };

  if (value <= 300)
    return {
      status: "Very Unhealthy",
      color: "#ef4444",
      message:
        "Air quality is very poor. Avoid prolonged outdoor exposure."
    };

  return {
    status: "Hazardous",
    color: "#7e22ce",
    message:
      "Severe health effects possible. Stay indoors and use protective measures."
  };
}

function DetailsPage() {
  const { station } = useParams();
  const navigate = useNavigate();
  const decodedStation = decodeURIComponent(station);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchStationData();
  }, []);

  const fetchStationData = async () => {
    try {
      const res = await axios.get("/api/data");

      const filtered = res.data.filter(
        item => item.station === decodedStation
      );

      setData(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  /* Ensure all pollutants exist, else set 0 */
  const completeData = useMemo(() => {
    return ALL_POLLUTANTS.map(pollutant => {
      const found = data.find(d => d.pollutant === pollutant);
      return {
        pollutant,
        value: found ? Number(found.value) : 0
      };
    });
  }, [data]);

  const lastUpdated = data[0]?.lastUpdate || "No Data";

  const averageAQI = useMemo(() => {
    if (completeData.length === 0) return 0;

    const values = completeData.map(d => d.value);
    return Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    );
  }, [completeData]);

  const explanation = getAirExplanation(averageAQI);

  return (
    <div className="details-container">

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <h1>{decodedStation}</h1>

      <p className="last-update">
        Last Updated: {lastUpdated}
      </p>

      {/* Air Quality Summary */}
      <div
        className="air-status-box"
        style={{ backgroundColor: explanation.color }}
      >
        <h2>{explanation.status}</h2>
        <p>{explanation.message}</p>
        <strong>Average AQI: {averageAQI}</strong>
      </div>

      {/* Pollutant Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Pollutant</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {completeData.map((item, index) => (
              <tr key={index}>
                <td>{item.pollutant}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DetailsPage;