const fs          = require("fs").promises;
const axios       = require("axios");
var path          = require("path");
var scriptChecks  = require("./lib/script-checks.js")
var cheerio       = require('cheerio')

var siteList;
var storedHTML;
var storedStatus;
var currentSite;
var currentIteration;
var i = 0;
var results;

init();

async function init () {
  await readSiteList();
  await checkResults();
  await loopSites();
}

async function readSiteList(){
    return fs.readFile('./site-list.js',"utf8")
    .then((data)=>{
      siteList = data.split("\r\n");
      console.log("\n" + "Number of domains to scan: " + siteList.length + "\n")
    })
}

function checkResults() {
    return fs.readFile('./Results.txt')
    .then((data) => {
      if (data) {
          return fs.unlink('Results.txt', (err) => {
            console.log('Deleting Results.txt and generating new results file.');
          });
      } else {
          return
      }
    })
    .catch((error)=> {
      return
    })
}

async function loopSites(){
  try {
    currentIteration = siteList[i];
    currentSite = "http://" + currentIteration;
    console.log(i + " of " + siteList.length + " : " + currentSite);
    await loadSite(currentSite);
    await runChecks(storedHTML, currentSite);
    await checkForTagManager(storedHTML, currentSite);
    await writeData(results);
    await checkIfDone();
  } catch (error) {
    console.log(error);
    i++
    loopSites();
  }
}

async function runChecks(data, site) {
  console.log("Running Checks....")
  results = ''
  var sf      = await scriptChecks.checkSF(data, site);
  var hubspot = await scriptChecks.checkHubspot(data, site);
  var marketo = await scriptChecks.checkMarketo(data, site);
  var acton   = await scriptChecks.checkActon(data, site);
  var cd      = await scriptChecks.checkClickDimensions(data, site);
  var pardot  = await scriptChecks.checkPardot(data, site);
  results = site + " " + sf + " " + hubspot + " " + marketo + " " + acton + " " + cd + " " + pardot + "\n";
}

function writeData(resultSet){
 console.log("Writing data....")
  return fs.appendFile("Results.txt", resultSet)
}

function checkIfDone(){
  if (i == siteList.length - 1) {
    console.log("Process Completed.");
  } else {
    i++
    loopSites();
  }
}

async function checkForTagManager(html, site) {
    try {
        if (html.indexOf("iframe src=\"//www.googletagmanager.com") != -1) {
            var gtmID = await parseGTM(html)
            var gtmScripts = await axios.get('https://www.googletagmanager.com/gtm.js?id=GTM-' + gtmID)
            await runChecks(gtmScripts.data, site);
        } else {
            console.log("No Injectors Found On: "+ site)
        }
    } catch (error) {
        console.log(error);
    }
}

function parseGTM(html) {
  console.log("Parsing GTM String....")
    var $ = cheerio.load(html);
    var gtmText = $('noscript').text();
    var splitGtmText = gtmText.split("GTM-")
    var seventhChar = splitGtmText[1].substr(6, 1)
    if (seventhChar == '"') {
        return splitGtmText[1].slice(0, 6);
    } else {
        return splitGtmText[1].slice(0, 7);
    }
}

function loadSite() {
  return axios.get(currentSite)
    .then(response => {
      storedHTML = response.data;
    })
    .catch(error => {
      storedHTML = "";
      currentEmail = ""
      splitEmail = ""
      fs.appendFile("Error-Log.txt", currentSite + " : Error Code - " + error.code + "\n");
      console.log("An error has occurred loading " + currentSite + ". Check the error.txt file for more information.");
    });
}
