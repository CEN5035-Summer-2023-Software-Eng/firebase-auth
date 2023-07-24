const { Client } = require("@elastic/elasticsearch");
const csv = require('csv-parser');
const fs = require('fs');
 
const client = new Client({ node: "https://elastic-group5.kub.hpc.fau.edu/" });
// elastic index name
const index = "electric-vehicle-washington";
// path to csv file
const filePath = "./Electric_Vehicle_Population_Data.csv";

let bulkData = [];

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    // For each row in the CSV, add an index operation and the data to the bulk array
    bulkData.push({ index: { _index: index } });
    bulkData.push(row);

    // If the bulk array contains 1000 operations, send a bulk request
    if (bulkData.length === 2000) {
      client.bulk({ body: bulkData }, (err, resp) => {
        if (err) console.log(err);
        else console.log(`Indexed ${resp.body.items.length} items`);
      });

      // Clear the bulk array
      bulkData = [];
    }
  })
  .on('end', () => {
    // If there are any remaining operations in the bulk array, send a final bulk request
    if (bulkData.length > 0) {
      client.bulk({ body: bulkData }, (err, resp) => {
        if (err) console.log(err);
        else console.log(`Indexed ${resp.body.items.length} items`);
      });
    }

    console.log('CSV file successfully processed');
  });
