var scriptChecks = {

  checkSF: function(data, site) {
    if (data.indexOf("sf_config") != -1 || data.indexOf("frt(") != -1) {
      console.log("SF Found");
      return "Salesfusion,"
    }else{
       return ","
      }
    },


  checkHubspot: function(data, site) {
    if (data.indexOf("hs-scripts.com") != -1) {
      console.log("Hubspot Found");
      return "Hubspot,"
    }else{
      return ","
    }
  },

  checkMarketo: function(data, site) {
    if (data.indexOf("munchkin") != -1) {
      console.log("Marketo Found");
      return "Marketo,"
    }else{
      return ","
    }
  },

  checkActon: function(data, site) {
    if (data.indexOf("acton/bn/tracker") != -1) {
      console.log("Act-On Found");
      return "Act-On,"
    }else{
      return ","
    }
  },

  checkClickDimensions: function(data, site, email) {
    if (data.indexOf("analytics.clickdimensions") != -1) {
      console.log("Click Dimensions Found");
      return "Click-Dimensions,"
    }else{
      return ","
    }
  },

  checkPardot: function(data, site) {
    if (data.indexOf(".pardot.com") != -1) {
      console.log("Pardot Found");
      return "Pardot,"
    }else{
      return ","
    }
  }

}

module.exports = scriptChecks;
