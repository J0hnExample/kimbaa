// Import dependencies
const fs = require("fs");
const PDFParser = require("pdf2json");

// Get all the filenames from the test folder
const files = fs.readdirSync("testFiles");

// All of the parse student
let student = [];

// Make a IIFE so we can run asynchronous code
(async () => {

    // Await all of the students to be passed
    // For each file in the test folder
    await Promise.all(files.map(async (file) => {

        // Set up the pdf parser
        let pdfParser = new PDFParser(this, 1);

        // Load the pdf document
        pdfParser.loadPDF(`patients/${file}`);

        // Parsed the patient
        let patient = await new Promise(async (resolve, reject) => {

            // On data ready
            pdfParser.on("pdfParser_dataReady", (pdfData) => {

                // The raw PDF data in text form
                const raw = pdfParser.getRawTextContent().replace(/\r\n/g, " ");

                // Return the parsed data
                resolve({
                    name: /Name\s(.*?)Address/i.exec(raw)[1].trim(),
                    address: /Address\s(.*?)Phone/i.exec(raw)[1].trim(),
                    phone: /Phone\s(.*?)Birthday/i.exec(raw)[1].trim(),
                    birthday: /Birthday\s(.*?)Email\sAddress/i.exec(raw)[1].trim(),
                    emailAddress: /Email\sAddress\s(.*?)Blood\stype/i.exec(raw)[1].trim(),
                    bloodType: /Blood\stype\s(.*?)Height/i.exec(raw)[1].trim(),
                    height: /Height\s(.*?)Weight/i.exec(raw)[1].trim(),
                    weight: /Weight\s(.*?)--/i.exec(raw)[1].trim()
                });

            });

        });

        // Add the data to the student array
        student.push(patient);

    }));

    // Save the extracted information to a json file
    fs.writeFileSync("student.json", JSON.stringify(student));

})();  