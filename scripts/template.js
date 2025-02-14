const fs = require("fs");
const path = require("path");

// Sample OCR Data (Replace this with actual OCR extracted text)
const ocrData = {
  data: [
    "STATE OF DELAWARE",
    "Delaware Department",
    "of Transportation",
    "NOTICE OF TOLL VIOLATION",
    "PURSUANT TO SECTION 4127 AND 4129 OF TITLE 21 AND SECTION 4101(h) and 4101(j) OF TITLE 11 OF THE DELAWARE CODE",
    "John Doe",
    "26 OLD RUDNICK LANE",
    "NOTICE DATE:",
    "02/01/2017",
    "DOVER, DE 19901",
    "RESPOND BY:",
    "02/18/2017",
    "VPSN0012345678",
    "Violation Notice Number",
    "FAILURE TO RESPOND WILL RESULT IN FURTHER",
    "COLLECTION ACTIVITIES, REGISTRATION HOLD,",
    "SUSPENSION AND/OR COURT ADJUDICATION.",
    "0001234567-1",
    "The Delaware Department of Transportation believes that the vehicle pictured",
    "in the photograph recently traveled through a Delaware toll lane without",
    "remitting the toll due of 1.00.",
    "Date: 02/01/2017",
    "Time:",
    "12:07:15",
    "Plaza:",
    "NEWARK",
    "Lane:",
    "4",
    "License Plate:",
    "JOHNDOE01",
    "DE",
    "PAYMENT DUE BY:",
    "02/18/2017",
    "CIVIL PENALTY CHARGE $ 25.00",
    "CIVIL PENALTY SURCHARGE $ 12.50",
    "TOLL DUE: $ 1.00",
    "ADMINISTRATIVE FEE: $ 25.00",
    "BALANCE DUE: $ 51.00",
    "To use our Pay By Phone option call 1-888-397-2773.",
    "Mail to: Delaware E-ZPass Violations Center, P.O. Box 697, Dover, DE 19903-0697",
    "TO DISPUTE: You have the right to APPEAL the total amount due.",
  ],
};

// Convert OCR text dynamically using regex and parsing logic
function parseOCR(ocrArray) {
  let parsedData = {
    state: "Delaware",
    department: "Delaware Department of Transportation",
    notice_type: "NOTICE OF TOLL VIOLATION",
    recipient: {
      name: "",
      address: "",
    },
    notice_details: {
      notice_date: "",
      respond_by: "",
      violation_notice_number: "",
    },
    violation_details: {
      violation_id: "",
      date: "",
      time: "",
      plaza: "",
      lane: "",
      license_plate: "",
      state: "",
    },
    payment_details: {
      payment_due_by: "",
      civil_penalty_charge: 0,
      civil_penalty_surcharge: 0,
      toll_due: 0,
      administrative_fee: 0,
      balance_due: 0,
    },
    contact_info: {
      phone: "",
      mail_to: "",
    },
    dispute_information: "",
  };

  // Loop through OCR text and extract details
  for (let i = 0; i < ocrArray.length; i++) {
    let line = ocrArray[i];

    if (line.includes("NOTICE DATE:"))
      parsedData.notice_details.notice_date = ocrArray[i + 1];
    if (line.includes("RESPOND BY:"))
      parsedData.notice_details.respond_by = ocrArray[i + 1];
    if (line.includes("VPSN"))
      parsedData.notice_details.violation_notice_number = line;

    if (line.includes("License Plate:")) {
      parsedData.violation_details.license_plate = ocrArray[i + 1];
      parsedData.violation_details.state = ocrArray[i + 2];
    }

    if (line.includes("Violation Notice Number"))
      parsedData.violation_details.violation_id = ocrArray[i - 1];

    if (line.includes("Date:"))
      parsedData.violation_details.date = ocrArray[i + 1];
    if (line.includes("Time:"))
      parsedData.violation_details.time = ocrArray[i + 1];
    if (line.includes("Plaza:"))
      parsedData.violation_details.plaza = ocrArray[i + 1];
    if (line.includes("Lane:"))
      parsedData.violation_details.lane = ocrArray[i + 1];

    if (line.includes("PAYMENT DUE BY:"))
      parsedData.payment_details.payment_due_by = ocrArray[i + 1];
    if (line.includes("CIVIL PENALTY CHARGE $"))
      parsedData.payment_details.civil_penalty_charge = parseFloat(
        line.replace(/[^0-9.]/g, "")
      );
    if (line.includes("CIVIL PENALTY SURCHARGE $"))
      parsedData.payment_details.civil_penalty_surcharge = parseFloat(
        line.replace(/[^0-9.]/g, "")
      );
    if (line.includes("TOLL DUE: $"))
      parsedData.payment_details.toll_due = parseFloat(
        line.replace(/[^0-9.]/g, "")
      );
    if (line.includes("ADMINISTRATIVE FEE: $"))
      parsedData.payment_details.administrative_fee = parseFloat(
        line.replace(/[^0-9.]/g, "")
      );
    if (line.includes("BALANCE DUE: $"))
      parsedData.payment_details.balance_due = parseFloat(
        line.replace(/[^0-9.]/g, "")
      );

    if (line.includes("To use our Pay By Phone option call"))
      parsedData.contact_info.phone = line.match(/\d{1,}-\d{3}-\d{3}-\d{4}/)[0];

    if (line.includes("Mail to:"))
      parsedData.contact_info.mail_to =
        ocrArray[i + 1] + ", " + ocrArray[i + 2];

    if (line.includes("TO DISPUTE:")) parsedData.dispute_information = line;
  }

  // Extract recipient name and address dynamically
  parsedData.recipient.name = ocrArray[5];
  parsedData.recipient.address = `${ocrArray[6]}, ${ocrArray[9]}`;

  return parsedData;
}

// Convert OCR data
const structuredData = parseOCR(ocrData.data);

// Save structured JSON to a file
const outputPath = path.join(__dirname, "toll_violation.json");

fs.writeFileSync(outputPath, JSON.stringify(structuredData, null, 2), "utf-8");

console.log("Structured JSON saved to:", outputPath);
