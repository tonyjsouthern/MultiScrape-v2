# MultiScrape v2
This application takes a list of websites and checks them for common Marketing Automation tracking scripts.

# Updates:
MultiScrape now checks for Google Tag Manager, pulls the scripts being loaded by it and checks those for for Marketing Automation scripts.

## Installation
 - Install the latest version of Node.JS: https://nodejs.org/en/download/
 - Clone or download repository
 - `CD` in project folder and run `npm install`
  - Run `npm start` to start application

## Configuration:
The following are steps to configuring a list to scan:
1. Create a file named `site-list.js` in the root directory or location of the exe file.
2. Use the below format to list your websites
3. Run `npm start` or simply double click your exe to run the application.

# Site-List.js Format:

Each line must contain nothing but the domain name and prefixes should not be included:

```  
  salesfusion.com
  websiteTwo.com
  websiteThree.com
```
