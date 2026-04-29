import Stations from "../stations.json" with { type: "json" };
import Lines from "../lines.json" with { type: "json" };
import TOCs from "../tocs.json" with { type: "json" };

let successCount = 0;
let errors = [];

function success(thingType: string, thing: string) {
  successCount++;
  console.log(`✅ ${thingType} '${thing}'`);
} 

function fail(thingType: string, thing: string, reason: string) {
  const error = `❌ ${thingType} '${thing}': ${reason}`;
  errors.push(error);
  console.log(error);
  process.exitCode = 1;
}

console.log("--- Stations ---");
for (const [station, stationData] of Object.entries(Stations)) {
  let failed = false;

  if (!stationData.displayName) {
    failed = true;
    fail("Station", station, "displayName is missing");
  }

  if (!stationData.lines) {
    failed = true;
    fail("Station", station, "lines is missing");
  } else {
    for (const line of stationData.lines) {
      if (!line) {
        failed = true;
        fail("Station", station, "Empty entry in lines");
      } else if (!Object.keys(Lines).includes(line)) {
        failed = true;
        fail("Station", station, `Line '${line}' does not exist in lines.json`);
      }
    }
  }

  if (!failed) {
    success("Station", station);
  }
}

console.log("--- Lines ---");
for (const [line, lineData] of Object.entries(Lines)) {
  let failed = false;

  if (!lineData.displayName) {
    failed = true;
    fail("Line", line, "displayName is missing");
  }

  if (!lineData.colour) {
    failed = true;
    fail("Line", line, "colour is missing");
  }

  if (!lineData.tocs) {
    failed = true;
    fail("Line", line, "tocs is missing");
  } else {
    for (const toc of lineData.tocs) {
      if (!toc) {
        failed = true;
        fail("Line", line, "Empty entry in tocs");
      } else if (!Object.keys(TOCs).includes(toc)) {
        failed = true;
        fail("Line", line, `TOC '${toc}' does not exist in tocs.json`);
      }
    }
  }

  if (!failed) {
    success("Line", line);
  }
}

console.log("--- TOCs ---");
for (const [toc, tocData] of Object.entries(TOCs)) {
  let failed = false;

  if (!tocData.displayName) {
    failed = true;
    fail("TOC", toc, "displayName is missing");
  }

  if (!tocData.colour) {
    failed = true;
    fail("TOC", toc, "colour is missing");
  }

  if (!failed) {
    success("TOC", toc);
  }
}

console.log("--- Summary ---");
console.log(`Successful checks: ${successCount}`);
console.log(`Failed checks: ${errors.length}`);

if (errors.length > 0) {
  console.log("\nErrors:");
  for (const error of errors) {
    console.log(error);
  }
}
