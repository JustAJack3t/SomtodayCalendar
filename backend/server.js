// imports dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

// gets somtoday key from .env file
const SOMTODAY_KEY = process.env.SOMTODAY_KEY;

// declares baseurl of somtoday api
const initialUrl = "https://api.somtoday.nl";



// fetches student json using somtoday key
async function fetchStudent(somtoday_key) {
  try {
    const response = await fetch(
      `${initialUrl}/rest/v1/leerlingen`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${somtoday_key}`,
          "Accept": "application/json",          
        }
      }
    );

    // throws http error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // converts response to json
    const data = await response.json();
    return data;

  } catch (err) {
    // catches other errors
    console.error("Request failed:", err.message);
  }
}


// fetches grades json's and returns merged grade json
async function fetchGrades(studentId) {
  try {
    // vars
    let lowerBound = 0;
    let upperBound = 99;
    let response;
    let fullResponse = { "items": [] };

    // loops until it gets less than 99 grades back
    while (true) {
      response = await fetch(
        `${initialUrl}/rest/v1/resultaten/huidigVoorLeerling/${studentId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${SOMTODAY_KEY}`,
            "Range": `items=${lowerBound}-${upperBound}`,
            "Accept": "application/json",
          }
        }
      );

      // throws http error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // converts response to json
      response = await response.json();

      // appends grades from response to fullResponse json
      for (let i = 0; i < response.items.length; i++) {
        fullResponse.items.push(response.items[i]);
      }

      // checks if less than 99 items have been returned
      if (response.items.length < 99) {
        break;
      }

      // updates vars
      lowerBound += 100;
      upperBound += 100;
    }

    // returns json with all grades
    return fullResponse;

  } catch (err) {
    //catches other errors
    console.error("Request failed:", err.message);
  }  
}



async function main() {
  // fetch student json
  const STUDENT = await fetchStudent(SOMTODAY_KEY);

  // fetch grades json
  const GRADES = await fetchGrades(STUDENT.items[0].links[0].id);

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