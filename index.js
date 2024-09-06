
var data = Array.from({length: 1000}, () => Math.floor(Math.random() * 10));

print_platform();
measure("reduce sum", () => { sum1(data) });
measure("for sum", () => { sum2(data) });

function sum1(data) {
  return data.reduce((acc, v) => acc + v, 0);
}

function sum2(data) {
  var sum = 0;
  for (var i=0; i<data.length; i++) sum += data[i];
  return sum;
}

function measure(name, fn) {
  var tmp;
  var minIter = 100;
  var minTime = 1000; // 1s
  var innerIter = 0;
  var warmupTime = 0;
  while (warmupTime < 10) {
    innerIter = innerIter > 0 ? innerIter * 10 : 1;
    var warmupStart = Date.now();
    for(var i=0; i<innerIter; i++) {
      tmp = fn();
    }
    warmupTime = Date.now() - warmupStart;
  }
  // pr("warmup time " + warmupTime + " inner iter = " + innerIter);
  var numIter = Math.ceil(minTime / warmupTime);
  if (numIter < minIter) numIter = minIter;
  var measureStart = Date.now();
  for (var i=0; i<numIter; i++) {
    for(var j=0; j<innerIter; j++) {
      tmp = fn();
    }
  }
  var measureTime = Date.now() - measureStart;
  pr(name + ": " + Math.floor(numIter * innerIter / measureTime * 1000) + " op/s");
}

function pr(str) {
  if (globalThis.console) {
    globalThis.console.log(str);
  } else {
    globalThis.print(str);
  }
}

function print_platform() {
  var engine, version;
  if (typeof Bun === "object") {
    engine = "bun";
  }
  else if (typeof HermesInternal === "object") {
    engine = "hermes";
    version = HermesInternal.getRuntimeProperties()["OSS Release Version"];
  }
  else if (typeof require === "function") {
    try {
      const process = require("process");
      if (process.versions.v8) {
        engine = "v8";
      }
      if (process.versions.node) {
        engine += ",node";
        version = process.versions.node;
      }
    } catch (e) {}
  }
  pr("Engine: " + (engine || "unknown") + (version ? " " + version : ""));
}