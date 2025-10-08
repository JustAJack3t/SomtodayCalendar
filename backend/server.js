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


// generates grade json containing only useful info
function generateGrades(gradeList) {
  try {
    // create list
    let usefulGradeList = { "items": [] };

    // loop through all grades
    for (let i = 0; i < gradeList.items.length; i++) {
      // for readability
      let grade = gradeList.items[i];

      // append dict to list
      usefulGradeList.items.push(
        {
          "vakNaam": grade.vak.naam,
          "vakAfkorting": grade.vak.afkorting,
          "omschrijving": grade.beschrijving,
          "type": grade.type,
          //not sure about the difference between resultaat & geldendResultaat
          "resultaat": grade.resultaat,
          "geldendResultaat": grade.geldendResultaat,
          "datumInvoer": grade.datumInvoer,
          "leerjaar": grade.leerjaar,
          "periode": grade.periode,
          "weging": grade.weging,
          "examenWeging": grade.examenWeging,
          "isExamendossierResultaat": grade.isExamendossierResultaat,
          "isVoortgangsdossierResultaat": grade.isVoortgangsdossierResultaat
        }
      );
    }

    return usefulGradeList;  

  } catch (err) {
    //catches errors
    console.error("Request failed:", err.message);
  }
}

async function main() {
  // fetch student json
  const STUDENT = await fetchStudent(SOMTODAY_KEY);

  // fetch grades json
  const GRADES = await fetchGrades(STUDENT.items[0].links[0].id);

  const USEFULGRADES = generateGrades(GRADES);

  console.log(JSON.stringify(USEFULGRADES));

  // log data for each grade
  for (let i = 0; i < USEFULGRADES.items.length; i++) {
    // log vak naam
    console.log(`\n\n${i}:\nNaam: ${USEFULGRADES.items[i].vakNaam}`);

    // log afkorting
    console.log(`Afkorting: ${USEFULGRADES.items[i].vakAfkorting}`); 

    // log omschrijving if it exists
    if (typeof USEFULGRADES.items[i].omschrijving !== "undefined") {
      console.log(`Omschrijving: ${USEFULGRADES.items[i].omschrijving}`);
    }

    // log type
    console.log(`Type: ${USEFULGRADES.items[i].type}`);

    // log resultaat if it exists
    if (typeof USEFULGRADES.items[i].resultaat !== "undefined") {
      console.log(`Resultaat: ${USEFULGRADES.items[i].resultaat}`);
    }

    // log geldendResultaat if it exists
    if (typeof USEFULGRADES.items[i].geldendResultaat !== "undefined") {
      console.log(`Geldend Resultaat: ${USEFULGRADES.items[i].geldendResultaat}`);
    }

    // log datumInvoer
    console.log(`Datum Invoer: ${USEFULGRADES.items[i].datumInvoer}`)

    // log leerjaar
    console.log(`Leerjaar: ${USEFULGRADES.items[i].leerjaar}`);

    // log periode
    console.log(`Periode: ${USEFULGRADES.items[i].periode}`);

    // log weging if it exists
    if (typeof USEFULGRADES.items[i].weging !== "undefined") {
      console.log(`Weging: ${USEFULGRADES.items[i].weging}`);
    }    

    // log examenWeging if it exists
    if (typeof USEFULGRADES.items[i].examenWeging !== "undefined") {
      console.log(`Examen Weging: ${USEFULGRADES.items[i].examenWeging}`);
    }    

    // log if it counts towards examens
    console.log(`Examendossier: ${USEFULGRADES.items[i].isExamendossierResultaat}`);

    // log if it counts towards overgang 
    console.log(`Voortgangsdossier: ${USEFULGRADES.items[i].isVoortgangsdossierResultaat}`);
  }
}

main();