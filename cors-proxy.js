import express from "express";
import request from "request";
import cors from "cors";
import axios from "axios";
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

app.get("/api/swap-quote", (req, res) => {
  const endpoint = "https://api.0x.org/swap/permit2/quote";
  const query = req.query;

  const apiUrl = `${endpoint}?${new URLSearchParams(query).toString()}`;

  request(
    {
      url: apiUrl,
      headers: {
        "0x-api-key": "704a6d41-1233-4739-904f-1079bf2d892f",
        "0x-version": "v2",
        "Content-Type": "application/json",
      },
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).json({ error: "Failed to fetch data" });
      }

      res.status(response.statusCode).send(body);
    }
  );
});

app.get("/api/get-price", async (req, res) => {
  try {
    const response = await axios.get(`https://matcha.xyz/api/gasless/price`, {
      params: req.query,
      headers: {
        "0x-api-key": "704a6d41-1233-4739-904f-1079bf2d892f",
        "0x-version": "v2",
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});
app.get("/api/usd-price", async (req, res) => {
  try {
    const response = await axios.get(`https://matcha.xyz/api/price/usd`, {
      params: req.query,
      headers: {
        "0x-api-key": "704a6d41-1233-4739-904f-1079bf2d892f",
        "0x-version": "v2",
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("API Proxy Error:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});


// app.get("/api/get-price", async (req, res) => {
//   try {
//     const response = await axios.get(`https://api.0x.org/swap/permit2/price`, {
//       params: req.query,
//       headers: {
//         "0x-api-key": "704a6d41-1233-4739-904f-1079bf2d892f",
//         "0x-version": "v2",
//         "Content-Type": "application/json",
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("API Proxy Error:", error.message);
//     res.status(error.response?.status || 500).json({ error: error.message });
//   }
// });


app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
