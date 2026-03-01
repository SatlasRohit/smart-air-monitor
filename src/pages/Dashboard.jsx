import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const ALL_POLLUTANTS = [
  "PM2.5",
  "PM10",
  "NO2",
  "SO2",
  "CO",
  "OZONE",
  "NH3"
];

function getAQIStatus(value) {
  if (value <= 50) return { label: "Good", color: "#22c55e" };
  if (value <= 100) return { label: "Moderate", color: "#eab308" };
  if (value <= 200) return { label: "Unhealthy", color: "#f97316" };
  if (value <= 300) return { label: "Very Unhealthy", color: "#ef4444" };
  return { label: "Hazardous", color: "#7e22ce" };
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/data");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* Group by station */
  const groupedData = useMemo(() => {
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.station]) grouped[item.station] = [];
      grouped[item.station].push(item);
    });
    return grouped;
  }, [data]);

  /* Filter stations by search */
  const filteredStations = Object.keys(groupedData).filter(station =>
    station.toLowerCase().includes(search.toLowerCase())
  );

  /* Overall AQI based on PM2.5 average */
  const overallAQI = useMemo(() => {
    const pm = data
      .filter(d => d.pollutant === "PM2.5")
      .map(d => Number(d.value));

    if (pm.length === 0) return 0;

    return Math.round(pm.reduce((a, b) => a + b, 0) / pm.length);
  }, [data]);

  /* Most Polluted Station (Highest PM2.5) */
  const mostPolluted = useMemo(() => {
    let max = 0;
    let worst = "";

    Object.keys(groupedData).forEach(station => {
      const pm = groupedData[station].find(
        d => d.pollutant === "PM2.5"
      );
      if (pm && pm.value > max) {
        max = pm.value;
        worst = station;
      }
    });

    return worst;
  }, [groupedData]);

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="top-bar">
        <h1>🌍 Chennai Air Quality Monitoring</h1>

        <div className="summary">
          <div className="aqi-box">
            Overall AQI: <strong>{overallAQI}</strong>
          </div>

          <div className="live-indicator">
            <span className="dot"></span> LIVE
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Station..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Most Polluted Badge */}
      {mostPolluted && (
        <div className="badge">
          🚨 Most Polluted Area: {mostPolluted}
        </div>
      )}

      <div className="station-grid">
        {filteredStations.map((station, index) => {

          const stationData = groupedData[station];
          const lastUpdated =
            stationData[0]?.lastUpdate || "No Data";

          return (
            <div key={index} className="station-card">

              <h2>{station}</h2>

              <p className="last-update">
                Last Updated: {lastUpdated}
              </p>

              {ALL_POLLUTANTS.map((pollutant, i) => {

                const found = stationData.find(
                  d => d.pollutant === pollutant
                );

                const value = found ? Number(found.value) : 0;
                const status = getAQIStatus(value);

                return (
                  <div key={i} className="pollutant-row">

                    <div className="pollutant-left">
                      <span>{pollutant}</span>
                      <span className="status">{status.label}</span>
                    </div>

                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.max(value, 5)}%`,
                          backgroundColor: status.color
                        }}
                      >
                        {value}
                      </div>
                    </div>

                  </div>
                );
              })}

              <div className="button-group">

                <button
                  className="graph-btn"
                  onClick={() =>
                    navigate(`/graph/${encodeURIComponent(station)}`)
                  }
                >
                  📈 View Graph
                </button>

                <button
                  className="details-btn"
                  onClick={() =>
                    navigate(`/details/${encodeURIComponent(station)}`)
                  }
                >
                  📊 View Details
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Dashboard;