const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const SOMTODAY_KEY = process.env.SOMTODAY_KEY;

const initialUrl = "https://api.somtoday.nl";

console.log("\n\n");

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


async function fetchGrades(studentId) {
  try {
    const response = await fetch(
      `${initialUrl}/rest/v1/resultaten/huidigVoorLeerling/${studentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${SOMTODAY_KEY}`,
          "Range": "items=0-100",
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
  const STUDENT = await fetchStudent();

  console.log(`GRADES:\n${JSON.stringify(await fetchGrades(STUDENT.items[0].links[0].id))}`);
}

main();