// import DocumentIntelligence from "@azure-rest/ai-document-intelligence";
// const invoiceUrl =
//   "https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf";

// module.exports = async () => {
//   const client = DocumentIntelligence(process.env.endpoint, {
//     key: process.env.key,
//   });

//   const poller = await client.beginAnalyzeDocument(
//     "prebuilt-invoice",
//     invoiceUrl
//   );

//   const {
//     documents: [result],
//   } = await poller.pollUntilDone();

//   if (result) {
//     const invoice = result.fields;

//     console.log("Vendor Name:", invoice.VendorName?.content);
//     console.log("Customer Name:", invoice.CustomerName?.content);
//     console.log("Invoice Date:", invoice.InvoiceDate?.content);
//     console.log("Due Date:", invoice.DueDate?.content);

//     console.log("Items:");
//     for (const { properties: item } of invoice.Items?.values ?? []) {
//       console.log("-", item.ProductCode?.content ?? "<no product code>");
//       console.log("  Description:", item.Description?.content);
//       console.log("  Quantity:", item.Quantity?.content);
//       console.log("  Date:", item.Date?.content);
//       console.log("  Unit:", item.Unit?.content);
//       console.log("  Unit Price:", item.UnitPrice?.content);
//       console.log("  Tax:", item.Tax?.content);
//       console.log("  Amount:", item.Amount?.content);
//     }

//     console.log("Subtotal:", invoice.SubTotal?.content);
//     console.log(
//       "Previous Unpaid Balance:",
//       invoice.PreviousUnpaidBalance?.content
//     );
//     console.log("Tax:", invoice.TotalTax?.content);
//     console.log("Amount Due:", invoice.AmountDue?.content);
//   } else {
//     throw new Error("Expected at least one receipt in the result.");
//   }
// };

