// pages/api/fetchData.js
export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    res.status(200).json(data); // Send back the fetched data
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
