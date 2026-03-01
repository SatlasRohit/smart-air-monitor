import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../services/socket"; // 🔥 important
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function GraphPage() {
  const { station } = useParams();
  const navigate = useNavigate();

  const decodedStation = decodeURIComponent(station);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHistory();

    /* 🔥 Listen for live updates */
    socket.on("newData", (newData) => {
      if (newData.station === decodedStation) {
        const formatted = {
          time: new Date(newData.createdAt).toLocaleTimeString(),
          value: newData.value
        };

        setData(prev => [...prev, formatted]);
      }
    });

    return () => socket.off("newData");

  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/data/history/${decodedStation}`
      );

      const formatted = res.data.map(item => ({
        time: new Date(item.createdAt).toLocaleTimeString(),
        value: item.value
      }));

      setData(formatted);

    } catch (err) {
      console.log(err);
    }
  };

  const chartWidth = Math.max(data.length * 120, 1500);

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white"
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          background: "#38bdf8",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: "30px" }}>
        {decodedStation} - Pollution Timeline
      </h1>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px"
        }}
      >
        <div
          style={{
            width: `${chartWidth}px`,
            height: "400px"
          }}
        >
          <LineChart
            width={chartWidth}
            height={400}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default GraphPage;