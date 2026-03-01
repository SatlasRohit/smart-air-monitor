import axios from "axios";

const API_KEY = "579b464db66ec23bdd00000140eebb05f3634d0978ccb6e0c61b219c";

export function startSimulator() {
  async function getChennaiData() {
    try {
      const response = await axios.get(
        "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
        {
          params: {
            "api-key": API_KEY,
            format: "json",
            "filters[city]": "Chennai",
            limit: 1000
          }
        }
      );

      const records = response.data.records;

      for (const record of records) {
        const data = {
          station: record.station,
          pollutant: record.pollutant_id,
          value: Number(record.avg_value),
          lastUpdate: record.last_update
        };

        await axios.post(
          `http://localhost:${process.env.PORT}/api/data`,
          data
        );
      }

      console.log("Government data sent to backend");

    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  setInterval(getChennaiData, 10000);
  getChennaiData();
}