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
    console.error("Request fetchStudent() failed:", err.message);
  }
}


// fetches grades json's and returns merged grade json
async function fetchGrades(studentId, somtoday_key) {
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
            "Authorization": `Bearer ${somtoday_key}`,
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
    // catches other errors
    console.error("Request fetchGrades() failed:", err.message);
  }  
}


// fetch homework json
async function fetchHomework(studentId, somtoday_key) {
  // appointment homework
  try {
    const responseAppointment = await fetch(
      `${initialUrl}/rest/v1/studiewijzeritemafspraaktoekenningen?begintNaOfOp=2025-10-09&geenDifferentiatieOfGedifferentieerdVoorLeerling=${studentId}&additional=huiswerkgemaakt`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${somtoday_key}`,
          "Accept": "application/json",
        }
      }
    )

    // throws http error
    if (!responseAppointment.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseDay = await fetch(
      `${initialUrl}/rest/v1/studiewijzeritemdagtoekenningen?begintNaOfOp=2025-10-09&geenDifferentiatieOfGedifferentieerdVoorLeerling=${studentId}&additional=huiswerkgemaakt`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${somtoday_key}`,
          "Accept": "application/json",
        }
      }
    )

    // throws http error
    if (!responseDay.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }   

    const responseWeek = await fetch(
      `${initialUrl}/rest/v1/studiewijzeritemweektoekenningen?begintNaOfOp=2025-10-09&geenDifferentiatieOfGedifferentieerdVoorLeerling=${studentId}&additional=huiswerkgemaakt`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${somtoday_key}`,
          "Accept": "application/json",
        }
      }
    )

    // throws http error
    if (!responseWeek.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // converts response to json
    const appointmentJson = await responseAppointment.json();
    const dayJson = await responseDay.json();
    const weekJson = await responseWeek.json();

    // make empty lists
    const appointmentData = { "items": [] }
    const dayData = { "items": [] }
    const weekData = { "items": [] }

    // loop through appointment homework
    for (let i = 0; i < appointmentJson.items.length; i++) {
      // for readability
      let appointment = appointmentJson.items[i];

      // push dict to list
      appointmentData.items.push(
        {
          // huiswerk info
          "huiswerkDatum": appointment.datumTijd,
          "huiswerkGemaakt": appointment.additionalObjects.huiswerkGemaakt,
          "huiswerkId": appointment.studiewijzerItem.links[0].id,
          "huiswerkType": appointment.studiewijzerItem.huiswerkType,
          "huiswerkOnderwerp": appointment.studiewijzerItem.onderwerp,
          "huiswerkOmschrijving": appointment.studiewijzerItem.omschrijving,
          "huiswerkLeerdoelen": appointment.studiewijzerItem.leerdoelen,

          // huiswerk bijlagen
          "huiswerkBijlagenOmschrijving": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].omschrijving : "undefined",
          "huiswerkBijlageUrl": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].assemblyResults[0].fileUrl : "undefined",

          // inleveropdrachten
          "isInleverOpdracht": appointment.studiewijzerItem.isInleverperiodes,
          "inleverOpdrachtStart": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].startGeldigheid : "undefined",
          "inleverOpdrachtEinde": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].eindGeldigheid : "undefined",
          "inleverOpdrachtPlagiaatDetectie": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].plagiaatDetectie : "undefined",
          "inleverOpdrachtAantalItemsIngeleverd": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].inleveringenAantal : "undefined",
        }
      )
    }

    // loop through day homework
    for (let i = 0; i < dayJson.items.length; i++) {
      // for readability
      let appointment = dayJson.items[i];

      // push dict to list
      dayData.items.push(
        {
          // huiswerk info
          "huiswerkDatum": appointment.datumTijd,
          "huiswerkGemaakt": appointment.additionalObjects.huiswerkGemaakt,
          "huiswerkId": appointment.studiewijzerItem.links[0].id,
          "huiswerkType": appointment.studiewijzerItem.huiswerkType,
          "huiswerkOnderwerp": appointment.studiewijzerItem.onderwerp,
          "huiswerkOmschrijving": appointment.studiewijzerItem.omschrijving,
          "huiswerkLeerdoelen": appointment.studiewijzerItem.leerdoelen,

          // huiswerk bijlagen
          "huiswerkBijlagenOmschrijving": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].omschrijving : "undefined",
          "huiswerkBijlageUrl": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].assemblyResults[0].fileUrl : "undefined",

          // inleveropdrachten
          "isInleverOpdracht": appointment.studiewijzerItem.isInleverperiodes,
          "inleverOpdrachtStart": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].startGeldigheid : "undefined",
          "inleverOpdrachtEinde": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].eindGeldigheid : "undefined",
          "inleverOpdrachtPlagiaatDetectie": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].plagiaatDetectie : "undefined",
          "inleverOpdrachtAantalItemsIngeleverd": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].inleveringenAantal : "undefined",
        }
      )
    }    

    // loop through week homework
    for (let i = 0; i < weekJson.items.length; i++) {
      // for readability
      let appointment = weekJson.items[i];

      // push dict to list
      weekData.items.push(
        {
          // huiswerk info
          "huiswerkWeek": appointment.weeknummerVanaf,
          "huiswerkGemaakt": appointment.additionalObjects.huiswerkGemaakt,
          "huiswerkId": appointment.studiewijzerItem.links[0].id,
          "huiswerkType": appointment.studiewijzerItem.huiswerkType,
          "huiswerkOnderwerp": appointment.studiewijzerItem.onderwerp,
          "huiswerkOmschrijving": appointment.studiewijzerItem.omschrijving,
          "huiswerkLeerdoelen": appointment.studiewijzerItem.leerdoelen,

          // huiswerk bijlagen
          "huiswerkBijlagenOmschrijving": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].omschrijving : "undefined",
          "huiswerkBijlageUrl": typeof appointment.studiewijzerItem.bijlagen[0] !== "undefined" ? appointment.studiewijzerItem.bijlagen[0].assemblyResults[0].fileUrl : "undefined",

          // inleveropdrachten
          "isInleverOpdracht": appointment.studiewijzerItem.isInleverperiodes,
          "inleverOpdrachtStart": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].startGeldigheid : "undefined",
          "inleverOpdrachtEinde": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].eindGeldigheid : "undefined",
          "inleverOpdrachtPlagiaatDetectie": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].plagiaatDetectie : "undefined",
          "inleverOpdrachtAantalItemsIngeleverd": typeof appointment.studiewijzerItem.inlevermomenten[0] !== "undefined" ? appointment.studiewijzerItem.inlevermomenten[0].inleveringenAantal : "undefined",
        }
      )
    }

    // merges homework types into one list
    const data = { "types": {
      "appointment": appointmentData,
      "day": dayData,
      "week": weekData
    } }

    return data;

  } catch (err) {
    // catches other errors
    console.error("Request fetchHomework() failed:", err.message, err);
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
  const GRADES = await fetchGrades(STUDENT.items[0].links[0].id, SOMTODAY_KEY);

  // simplifies grades json
  const USEFULGRADES = generateGrades(GRADES);

  // fetch homework json
  const HOMEWORK = await fetchHomework(STUDENT.items[0].links[0].id, SOMTODAY_KEY);
}

main();