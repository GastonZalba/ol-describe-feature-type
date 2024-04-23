(function () {
  var parser = new DescribeFeatureType();

  var parsed = document.getElementById("parsed");
  var raw = document.getElementById("raw");
  var version = document.getElementById("version");

  document.getElementById("321").onclick = () => {
    loadExample("example-3.2.1.xml");
  };

  document.getElementById("exception").onclick = () => {
    loadExample("example-exception.xml");
  };

  var parseBtn = document.getElementById("parseBtn");
  parseBtn.onclick = parseInput;

  var parseFormatedBtn = document.getElementById("parseFromatedBtn");
  parseFormatedBtn.onclick = parseInputFormated;

  var cleanBtn = document.getElementById("cleanBtn");
  cleanBtn.onclick = () => {
    parsed.value = "";
    raw.value = "";
    version.innerText = "";
  };

  function parseInputFormated() {
    if (!raw.value) return;
    var parsedData = parser.readFormated(raw.value);
    version.innerText = "(formated)";
    parsed.value = JSON.stringify(parsedData, undefined, 4);
  }

  function parseInput() {
    if (!raw.value) return;
    var parsedData = parser.read(raw.value);
    version.innerText = "(literal)";
    parsed.value = JSON.stringify(parsedData, undefined, 4);
  }

  function loadExample(file) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", file, false);
    xhttp.send();

    const xml = xhttp.responseText;
    if (xml) {
      raw.value = xml;
      parseInputFormated();
    }
  }
  
  // load this example on init
  loadExample("example-3.2.1.xml");
})();
