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


async function fetchGrades(studentId, lowerBound, upperBound) {
  try {
    const response = await fetch(
      `${initialUrl}/rest/v1/resultaten/huidigVoorLeerling/${studentId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${SOMTODAY_KEY}`,
          "Range": `items=${lowerBound}-${upperBound}`,
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

  //console.log(`GRADES:\n${JSON.stringify(await fetchGrades(STUDENT.items[0].links[0].id))}`);
  const GRADES = await fetchGrades(STUDENT.items[0].links[0].id, 0, 80);

  // log data for each grade
  for (let i = 0; i < GRADES.items.length; i++) {
    // log vak naam
    console.log(`\n\n${i}:\n${GRADES.items[i].vak.naam}`);

    // log omschrijving if it exists
    if (typeof GRADES.items[i].omschrijving !== "undefined") {
      console.log(`Omschrijving: ${GRADES.items[i].omschrijving}`);
    }

    // log resultaat if it exists
    if (typeof GRADES.items[i].resultaat !== "undefined") {
      console.log(`Resultaat: ${GRADES.items[i].resultaat}`);
    }

    // log geldendResultaat if it exists
    if (typeof GRADES.items[i].geldendResultaat !== "undefined") {
      console.log(`Geldend Resultaat: ${GRADES.items[i].geldendResultaat}`);
    }

    // log leerjaar
    console.log(`Leerjaar: ${GRADES.items[i].leerjaar}`);

    // log periode
    console.log(`Periode: ${GRADES.items[i].periode}`);

    // log weging if it exists
    if (typeof GRADES.items[i].weging !== "undefined") {
      console.log(`Weging: ${GRADES.items[i].weging}`);
    }    

    // log examenWeging if it exists
    if (typeof GRADES.items[i].examenWeging !== "undefined") {
      console.log(`Examen Weging: ${GRADES.items[i].examenWeging}`);
    }    

    // log if it counts towards examens
    console.log(`Examendossier: ${GRADES.items[i].isExamendossierResultaat}`);

    // log if it counts towards overgang 
    console.log(`Voortgangsdossier: ${GRADES.items[i].isVoortgangsdossierResultaat}`);
  }
}

main();