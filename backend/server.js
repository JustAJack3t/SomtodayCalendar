const dotenv = require('dotenv');
dotenv.config();

const SOMTODAY_KEY = process.env.SOMTODAY_KEY;

const initialUrl = "https://api.somtoday.nl";


async function fetchStudent() {
  try {
    const response = await fetch(
      `${initialUrl}/rest/v1/leerlingen`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${SOMTODAY_KEY}`,
          "Accept": "application/json",          
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

async function main() {
  console.log(JSON.stringify(await fetchStudent())); 
}

main();