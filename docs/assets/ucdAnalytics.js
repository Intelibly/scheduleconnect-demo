 /**
 * This is the master ucdAnalytics file responsible for controlling input to all coremetrics script tags.
 */

/**
 * Namespace for all the analytics code. Functions within this namespace should be referenced as UCD_ANALYTICS.[functionName]
 * Example: "UCD_ANALYTICS.ucdSetClientId();"
 */
var UCD_ANALYTICS = UCD_ANALYTICS || {

  siteId:undefined,//where the tags will be reported
  analyticsOn:true,
  brand:undefined,//the current brand's associated object
  brandId:undefined,//the current brand's id in the brands array
  app:undefined,//the current app's associated object
  categoryId:undefined,
  prefixFormIdWithPageId: true,//prepends page id to form ids in form reporting for easier understanding of reports 
  disableUnicaTagging: false,
  
  manualPageviewsCalled: [],//saves manual page views that have been called so that they are only reported once rather than repeatedly, hacked solution to a hacked solution

  /* Brand must be determined manually locally since the algorithm depends on the url.
   * Set this variable to the brand id you wish to test with locally. */
  localhostBrandId: "ucd",

  /**
   * All brands should be listed within this array even if not tracked.  They will only be tracked if listed in the brands
   * array on the apps below.
   */
  brands: [
    //new Brand(Name, SiteId, CategoryId, Domain, SubDomain [use "" for www], Default App Alias );
    ["ucd", new Brand("United Concordia", "UNITEDCONCORDIA", "UCD", "unitedconcordia.com", "", "default")],
    ["unm", new Brand("Unum Dental", "PARTNER", "UNM", "unumdental.com", "", "default")],
    ["slf", new Brand("Sunlife Dental", "PARTNER", "SLF", "sunlifedentalbenefits.com", "", "default")],
    ["addp", new Brand("ADDP", "ADDP", "ADDP", "addp-ucci.com", "secure", "default")],
    ["fedvip", new Brand("FEDVIP", "FEDVIP", "FEDVIP", "uccifedvip.com", "", "dwafep")],
    ["tdp", new Brand("TDP", "TDP", "TDP", "uccitdp.com", "", "default")],
    ["odc", new Brand("OUR DENTAL COVERAGE", "PARTNER", "ODC", "ourdentalcoverage.com", "", "default")],
    ["ghc-odc", new Brand("OUR DENTAL COVERAGE GHC", "PARTNER", "ODC:GHC", "ourdentalcoverage.com", "ghc", "ducdpw")],
    ["lhp-odc", new Brand("OUR DENTAL COVERAGE LHP", "PARTNER", "ODC:LHP", "ourdentalcoverage.com", "lhp", "default")],
    ["la-odc", new Brand("OUR DENTAL COVERAGE LA", "PARTNER", "ODC:LA", "ourdentalcoverage.com", "la", "default")],
    ["ri-odc", new Brand("OUR DENTAL COVERAGE RI", "PARTNER", "ODC:RI", "ourdentalcoverage.com", "ri", "default")],
    ["wy-odc", new Brand("OUR DENTAL COVERAGE WY", "PARTNER", "ODC:WY", "ourdentalcoverage.com", "wy", "default")],
    ["lsv", new Brand("MY DENTAL COVERAGE", "PARTNER", "MDC", "mydentalcoverage.com", "", "lsv")],
    ["ar-lsv", new Brand("MY DENTAL COVERAGE AR", "PARTNER", "MDC:AR", "mydentalcoverage.com", "ar", "lsv")],
    ["fl-lsv", new Brand("MY DENTAL COVERAGE FL", "PARTNER", "MDC:FL", "mydentalcoverage.com", "fl", "lsv")],
    ["hi-lsv", new Brand("MY DENTAL COVERAGE HI", "PARTNER", "MDC:HI", "mydentalcoverage.com", "hi", "lsv")],
    ["ma-lsv", new Brand("MY DENTAL COVERAGE MA", "PARTNER", "MDC:MA", "mydentalcoverage.com", "ma", "lsv")]
  ],

  apps: [
    //Default - used when the app-alias cannot be determined
    ["default", (function() {
      var alias = "default";// must be set to default app alias
      var brandList = [ "ucd", "unm", "slf", "addp", "odc", "lhp-odc", "la-odc", "ri-odc", "wy-odc" ];
      var name = "";// N/A
      var app = new App(alias, brandList, name);
      app.categoryList = [];
      return app;
    }())],
      
    //Ucd, Unm, & Slf Websites
    ["ducdws", (function() {
      var alias = "dental-insurance";
      var brandList = [ "ucd", "unm", "slf" ];
      var name = "Website";
      var ducdws = new App(alias, brandList, name);
      ducdws.categoryList = [new Category("GOVERNMENT", "/dental-insurance/home/government/", ["unm", "slf"]),
         new Category("PRODUCER", "/dental-insurance/producer/", ["unm", "slf"]),
         new Category("EMPLOYER", "/dental-insurance/employer/", ["unm", "slf"]),
         new Category("DENTIST", "/dental-insurance/dentist/", ["unm", "slf"]),
         new Category("ABOUT", "/dental-insurance/about/", ["unm", "slf"]),
         new Category("CLIENTSCORNER", "/dental-insurance/member/clients-corner/", ["unm", "slf"]),
         new Category("MEMBER", "/dental-insurance/member/"),
         new Category("DHC", "/dental-insurance/dental/"),
         new Category("INDIVIDUAL", "/dental-insurance/individual/", ["all"]),
         new Category("HOME", "/dental-insurance/") ];
      ducdws.search = new Search("/dental-insurance/home/search-results/", "#hiddenSearchResultsCount","#topSearchQuery");
      ducdws.specialPaths = [new SpecialPath("/dental-insurance/", "/dental-insurance/home/")];
      return ducdws;
    }())],

    //Fedvip Website
    ["dwafep", (function() {
      var alias = "fedvip";
      var brandList = [ "fedvip" ];
      var name = "Website";
      var dwafep = new App(alias, brandList, name);
      dwafep.categoryList = [new Category("DHC", "/fedvip/dental-health-center/"),
         new Category("ABO", "/fedvip/agency-benefit-officers/"),
         new Category("HOME", "/fedvip/") ];
      dwafep.search = new Search("/fedvip/search-results/", "#hiddenSearchResultsCount","#topSearchQuery");
      dwafep.specialPaths = [new SpecialPath("/fedvip/home/", "/fedvip/")];
      return dwafep;
    }())],

    //Addp Website
    ["dwaddw", (function() {
      var alias = "dwaddw";
      var brandList = [ "addp" ];
      var name = "Website";
      var dwaddw = new App(alias, brandList, name);
      dwaddw.categoryList = [new Category("ADSM", "/dwaddw/adsm/"),
        new Category("DENTIST", "/dwaddw/dentist/"),
        new Category("GOVERNMENT", "/dwaddw/government/"),
        new Category("INFO", "/dwaddw/article.xhtml"),
        new Category("HOME", "/dwaddw/home.xhtml") ];
      dwaddw.search = new Search("/dwaddw/search-results.xhtml", "#hiddenSearchResultsCount","[id$=topSearchQuery]");
      dwaddw.specialPaths = [new SpecialPath("/dwaddw/home.xhtml", "/dwaddw/")];
      dwaddw.params = ["content"];
      return dwaddw;
    }())],

    //My Dental Benefits
    ["ducdmr", (function() {
      var alias = "ducdmr";
      var brandList = [ "ucd", "unm", "slf", "lsv", "ar-lsv", "fl-lsv", "hi-lsv", "ghc-odc", "la-odc", "ri-odc", "tdp" ];
      var name = "My Dental Benefits";
      var ducdmr = new App(alias, brandList, name);
      ducdmr.categoryList = [new Category("MDB:INTERNAL", "/ducdmr/internal/", ["all"]),
          new Category("MDB:INTERNAL", "/ducdmr/ssoTest/", ["all"]),
        new Category("MDB", "/ducdmr/")];
      ducdmr.registration = new Registration('/ducdmr/member/secure/enrollment-summary/', 'userKeyForm\\:userKey');
      ducdmr.siteId = "MYDENTALBENEFITS";
      ducdmr.disableAutoLinkTracking = true;
      return ducdmr;
    }())],

    //My Dental Coverage Teamsite Pages
    ["lsv", (function() {
      var alias = "lsv";
      var brandList = [ "lsv", "ar-lsv", "hi-lsv", "fl-lsv" ];
      var name = "Website";
      var lsv = new App(alias, brandList, name);
      lsv.specialPaths = [ new SpecialPath("/index.shtml", "/")];
      return lsv;
    }())],

    //Webmail forms in /non-ldap/forms/ location
    ["nonldap", (function() {
      var alias = "non-ldap";
      var brandList = [ "ucd", "slf", "unm" ];
      var name = "Nonldap Forms";
      var nonldap = new App(alias, brandList, name);
      nonldap.categoryList = [ new Category("CONTACTUS", "/non-ldap/forms/") ];
      return nonldap;
    }())],
    
    //APDT
    ["dadtpi", (function() {
      var alias = "dadtpi";
      var brandList = [ "addp" ];
      var name = "ADDP Patient Data Tracker";
      var dadtpi = new App(alias, brandList, name);
      dadtpi.categoryList = [ new Category("APDT", "/dadtpi/", "/dadtpi/content/", "/dadtpi/content/inquiry.xhtml", "/dadtpi/content/claims/inquiry/claimsinquiry.xhtml", "/dadtpi/content/eligibility/eligibility.xhtml") ];
      return dadtpi;
    }())],
    
    //DHA
    ["dharia", (function() {
      var alias = "dha";
      var brandList = [ "ucd" ];
      var name = "Dental Health Assessment";
      var dharia = new App(alias, brandList, name);
      dharia.categoryList = [ new Category("DHA", "/dha/", "/dha/app/") ];
      return dharia;
    }())],
    
    //Provider Check Info
    ["tuctcm", (function() {
      var alias = "tuctcm";
      var brandList = [ "ucd" ];
      var name = "Provider Check Info";
      var tuctcm = new App(alias, brandList, name);
      tuctcm.categoryList = [ new Category("PROVCHECKINFO", "/tuctcm/", "/tuctcm/tcmmain.jsp") ];
      return tuctcm;
    }())],
    
    //Provider Data Online
    ["tp2pdo", (function() {
      var alias = "tp2pdo";
      var brandList = [ "ucd" ];
      var name = "Provider Data Online";
      var tp2pdo = new App(alias, brandList, name);
      tp2pdo.categoryList = [ new Category("PROVDATAONLINE",  "/tp2pdo/") ];
      return tp2pdo;
    }())],

    //Clients Corner
    ["tuctcc", (function() {
      var alias = "tuctcc";
      var brandList = [ "ucd" ];
      var name = "Clients Corner";
      var tuctcc = new App(alias, brandList, name);
      tuctcc.categoryList = [ new Category("CLIENTSCORNER", "/tuctcc/") ];
      tuctcc.params = ["id"];
      return tuctcc;
    }())],

    //Speed eClaim
    ["tcltic", (function() {
      var alias = "tcltic";
      var brandList = [ "ucd", "addp" ];
      var name = "Speed eClaim";
      var tcltic = new App(alias, brandList, name);
      tcltic.categoryList = [ new Category("ECLAIM", "/tcltic/") ];
      return tcltic;
    }())],
    
    //My Patients Benefits
    ["tuctpi", (function() {
      var alias = "tuctpi";
      var brandList = [ "ucd" ];
      var name = "My Patients Benefits";
      var tuctpi = new App(alias, brandList, name);
      tuctpi.categoryList = [ new Category("MPB", "/tuctpi/") ];
      tuctpi.registration = new Registration('/tuctpi/subscriber.xhtml', 'userKey');
      return tuctpi;
    }())],

    //TRICARE Dental Program Website
    ["dtwdws", (function() {
      var alias = "dtwdws";
      var brandList = [ "ucd","tdp" ];
      var name = "TRICARE Dental Program Website";
      var dtwdws = new App(alias, brandList, name);
      dtwdws.categoryList = [ new Category("HOME", "/dtwdws/"),
                              new Category("DENTIST", "/dtwdws/dentist/"),
                              new Category("GOVERNMENT", "/dtwdws/government/"),
                              new Category("MEMBER", "/dtwdws/member/") ];
      dtwdws.search = new Search("/dtwdws/search-results.xhtml", "#hiddenSearchResultsCount","[id$=searchQuery]");
      dtwdws.params = ["content"];
      return dtwdws;
    }())],

    //Registration and Recovery App (SSO)
    ["duadrr", (function() {
      var alias = "duadrr";
      var brandList = [ "ucd", "unm", "slf", "lsv", "ar-lsv", "fl-lsv", "hi-lsv", "ghc-odc", "la-odc", "tdp", "wy-odc" ];
      var name = "Registration/SSO";
      var duadrr = new App(alias, brandList, name);
      duadrr.categoryList = [ new Category("SSO", "/duadrr/")];
      var appendStage = function(path) {
        //find the current bolded list item
        var stage = $.trim($("li.current").text());
        stage = stage.replace(/\s+/g, '');
        stage = stage.toLowerCase();
        //only append if string is expected
        switch(stage) {
          case "getstarted":
          case "providedetails":
          case "confirmation":
          case "retrieveusername":
          case "resetpassword":
            path += "-" + stage;
            break;
          default:
            //do nothing if not matching
        }
        return path;
      };
      duadrr.specialPaths = [ new SpecialPath("/duadrr/registration.xhtml", null, appendStage),
        new SpecialPath("/duadrr/forgot-password.xhtml", null, appendStage),
        new SpecialPath("/duadrr/forgot-username.xhtml", null, appendStage),
        new SpecialPath("/duadrr/", "/duadrr/login.xhtml")];
      return duadrr;
    }())],

    //Our Dental Coverage Site
    ["ducdpw", (function() {
      var alias = "ducdpw";
      var brandList = [ "ghc-odc" ];
      var name = "Website";
      var ducdpw = new App(alias, brandList, name);
      return ducdpw;
    }())],

    //Mail forms
    ["ducdim", (function() {
      var alias = "contact-us";
      var brandList = [ "ucd", "slf", "unm", "fedvip" ];
      var name = "Contact Us";
      var ducdim = new App(alias, brandList, name);
      ducdim.categoryList=[ new Category("CONTACTUS", "/contact-us/") ];
      ducdim.specialPaths= [ new SpecialPath("/contact-us/home.xhtml", "/contact-us/")];
      return ducdim;
    }())],

    //Old Mail Forms
    ["tuctim", (function() {
      var alias = "tuctim";
      var brandList = [ "ucd" ];
      var name = "Contact Us";
      var tuctim = new App(alias, brandList, name);
      tuctim.categoryList=[ new Category("CONTACTUS", "/tuctim/") ];
      return tuctim;
    }())],

    //Dental Plan Navigator
    ["dncdpp", (function() {
      var alias = "dncdpp";
      var brandList = [ "ucd" ];
      var name = "Dental Plan Navigator";
      var dncdpp = new App(alias, brandList, name);
      dncdpp.categoryList=[ new Category("DPN", "/dncdpp/") ];
      var appendStage = function(path) {
        //find the current bolded list item
        var stage = $.trim($("li.active").text());
        stage = stage.replace(/\s+/g, '');
        stage = stage.toLowerCase();
        //only append if string is expected
        switch(stage) {
                  case "1.getstarted":
                  case "2.providedetails":
                  case "3.planresults":
                    stage = stage.substring(2);//remove #.
            path += "-" + stage;
            break;
          default:
            //do nothing if not matching
        }
        return path;
      };  
      dncdpp.specialPaths= [ new SpecialPath("/dncdpp/dental-plan-navigator.xhtml", null, appendStage), 
        new SpecialPath("/dncdpp/", "/dncdpp/dental-plan-navigator.xhtml", appendStage)];
      return dncdpp;
    }())],

    //eReporting
    ["tecder", (function() {
      var alias = "tecder";
      var brandList = [ "ucd" ];
      var name = "eReporting";
      var tecder = new App(alias, brandList, name);
      tecder.categoryList=[ new Category("EREPORTING", "/tecder/") ];
      return tecder;
    }())],
    
    //AMP
    ["tadgpt", (function() {
      var alias = "tadgpt";
      var brandList = [ "ucd" ];
      var name = "Account Management Portal";
      var tadgpt = new App(alias, brandList, name);
      tadgpt.categoryList=[ new Category("AMP", "/tadgpt/") ];
      return tadgpt;
    }())],

    //Find a dentist
    ["tp2fad", (function() {
      var alias = "find-a-dentist";
      var brandList = [ "ucd",  "unm", "slf", "addp", "fedvip", "odc", "ghc-odc", "la-odc", "ri-odc", "lsv", "ar-lsv", "fl-lsv", "hi-lsv", "ma-lsv", "tdp", "wy-odc"];
      var name = "Find a Dentist";
      var tp2fad = new App(alias, brandList, name);
      tp2fad.categoryList=[ new Category("FAD", "/find-a-dentist/") ];
      return tp2fad;
    }())],

    //e-Enroll
    ["demeen", (function() {
      var alias = "demeen";
      var brandList = [ "ucd" ];
      var name = "e-Enroll";
      var demeen = new App(alias, brandList, name);
      demeen.categoryList=[ new Category("EENROLL", "/demeen/") ];
      return demeen;
    }())],
    
    //Electronic Funds Transfer (EFT)
    ["tp2pft", (function() {
      var alias = "tp2pft";
      var brandList = [ "ucd" ];
      var name = "Electronic Funds Transfer";
      var tp2pft = new App(alias, brandList, name);
      tp2pft.categoryList=[ new Category("EFT", "/tp2pft/") ];
      return tp2pft;
    }())],

    //DHMO CAP Reports
    ["tp2tcp", (function() {
      var alias = "tp2tcp";
      var brandList = [ "ucd" ];
      var name = "DHMO CAP Reports";
      var tp2tcp = new App(alias, brandList, name);
      tp2tcp.categoryList=[ new Category("DHMOCAPREPORTS",  "/tp2tcp/capreports/")  ];
      return tp2tcp;
    }())]

    ],

  /**
   * Function which is called at the bottom of this file once all namespaces have been defined
   * and is thus called within the htmlhead of every page in which this file is included.
   */
  init: function() {
    //turns off analytics if coremetrics code cannot be found
    if (typeof window.cmSetClientID !== 'function') {
      UCD_ANALYTICS.analyticsOn = false;  
    }
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    UCD_ANALYTICS.setSiteVariables();
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    UCD_ANALYTICS.ucdSetClientId();
    UCD_ANALYTICS.ucdCmOther();
    UCD_ANALYTICS.util.fireFunctionOnLoad(UCD_ANALYTICS.bottomScripts);
    UCD_ANALYTICS.util.fireFunctionOnLoad(UCD_ANALYTICS.app.fireOnLoad);
  },

  /**
   * Sets and validates the variables required for analytics to properly function.  If any of
   * the variables fails to validate after being set, analytics will be disabled.
   */
  setSiteVariables: function() {
    UCD_ANALYTICS.setBrand();
    if (!UCD_ANALYTICS.validateBrand()) {  return; }
    UCD_ANALYTICS.setApp();
    if (!UCD_ANALYTICS.validateApp()) {  return; }
    UCD_ANALYTICS.setSiteId();
    if (!UCD_ANALYTICS.validateSiteId()) {  return; }
    UCD_ANALYTICS.setCategoryId();
    if (!UCD_ANALYTICS.validateCategoryId()) {  return; }
  },
  
  /** 
   * Checks whether the brand and brandId are currently defined.
   */
  validateBrand: function() {
    if (UCD_ANALYTICS.analyticsOn && (!UCD_ANALYTICS.brand || !UCD_ANALYTICS.brandId) ) { 
      UCD_ANALYTICS.analyticsOn = false; 
    }
    return UCD_ANALYTICS.analyticsOn;
  },
  
  /** 
   * Checks whether the app is currently defined and if the current brand is valid for
   * this application.
   */
  validateApp: function() {
    if (UCD_ANALYTICS.analyticsOn && ( !UCD_ANALYTICS.app || !UCD_ANALYTICS.app.isBrandValid(UCD_ANALYTICS.brandId) ) ) { 
      UCD_ANALYTICS.analyticsOn = false; 
    }
    return UCD_ANALYTICS.analyticsOn;
  },

  validateSiteId: function() {
    if (UCD_ANALYTICS.analyticsOn && !UCD_ANALYTICS.siteId ) { 
      UCD_ANALYTICS.analyticsOn = false; 
    }
    return UCD_ANALYTICS.analyticsOn;
  },

  validateCategoryId: function() {
    if (UCD_ANALYTICS.analyticsOn && !UCD_ANALYTICS.categoryId ) { 
      UCD_ANALYTICS.analyticsOn = false; 
    }
    return UCD_ANALYTICS.analyticsOn;
  },

  /**
   * Sets the Brand Id and Brand Object by matching the domain to one of the brands in the list. If 
   * the brand has a subdomain indicated in its brand object, that must also match.
   * 
   * When this file is locally hosted, this process is overriden since the domain is not available
   * for matching.
   */
  setBrand: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    if (UCD_ANALYTICS.util.isLocal()) {
      UCD_ANALYTICS.setLocalBrand();
      return;
    }
    for (var index = 0; index < UCD_ANALYTICS.brands.length; index++) {
      var brand = UCD_ANALYTICS.brands[index][1];
      if (brand.matchesDomain()) {
        UCD_ANALYTICS.brand = brand;
        UCD_ANALYTICS.brandId = UCD_ANALYTICS.brands[index][0];
        UCD_ANALYTICS.setDefaultApp();
        break;
      }
    }
  },
  
  /**
   * Sets the brand object to the brand with the given brandId set on the localhostBrandId
   * at the top of this file
   */
  setLocalBrand: function() {
    for (var index = 0; index < UCD_ANALYTICS.brands.length; index++) {
      if (UCD_ANALYTICS.localhostBrandId === UCD_ANALYTICS.brands[index][0]) {
        UCD_ANALYTICS.brand = UCD_ANALYTICS.brands[index][1];
        UCD_ANALYTICS.brandId = UCD_ANALYTICS.localhostBrandId;
      }
    }
  },

  /*
   * if the brand has a defaultApp, set the default app
   */
  setDefaultApp: function() {
    if (!UCD_ANALYTICS.brand.defaultApp) { return; }
    for (var appIndex = 0; appIndex < UCD_ANALYTICS.apps.length; appIndex++) {
      var app = UCD_ANALYTICS.apps[appIndex][1];
      if (app.alias === UCD_ANALYTICS.brand.defaultApp) {
        UCD_ANALYTICS.app = app;
        break;
      }
    }
  },

  /**
   * Matches the current app alias to the the app list to find the current app object.
   */
  setApp: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    for (var index = 0; index < UCD_ANALYTICS.apps.length; index++) {
      var app = UCD_ANALYTICS.apps[index][1];
      if (app.alias === UCD_ANALYTICS.util.getAppAlias()) {
        UCD_ANALYTICS.app = app;
        break;
      }
    }
  },

  /**
   * The site id should be set to the app's site id, but if that is not set, the
   * brand's site id will be used, which should always be set.
   */
  setSiteId: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    
    UCD_ANALYTICS.siteId = UCD_ANALYTICS.app.siteId;
    if (!UCD_ANALYTICS.siteId) {
      UCD_ANALYTICS.siteId = UCD_ANALYTICS.brand.siteId;
    }
  },

  setCategoryId: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    UCD_ANALYTICS.categoryId = UCD_ANALYTICS.app.getCategoryId(UCD_ANALYTICS.brand.categoryId, UCD_ANALYTICS.brandId);
  },

  /**
   * Function which should be called at the bottom of every page with coremetrics.
   */
  bottomScripts: function() {
    UCD_ANALYTICS.overlayUnicaTags();
    UCD_ANALYTICS.ucdCreatePageViewTag();
    UCD_ANALYTICS.ucdCreateRegistrationTag();
  },

  /**
   * Adds on click events to the elements on the page
   */
  addClickEvents: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }

  },
  
  /**
   * Determines the correct parameters for call to cmSetClientId based on the given
   * site Id and domain.  Should be called in the html head of every page which wishes 
   * to track anything using Digital Analytics.
   */
  ucdSetClientId: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    
    // Determine whether to use prod or test client id and data site
    var dataSite;
    var testDataSite = "testdata.coremetrics.com";
    var prodDataSite = "data.coremetrics.com";
    var clientId;
    var prodClientId = "51130000";
    var testClientId = "81130000";
    
     // Test if hostname contains apps.highmark.com.
    if ((window.location.hostname.indexOf("apps.highmark.com") > - 1)) {
      clientId = prodClientId;
      dataSite = prodDataSite;
    }
    // Test if hostname contains local, highmark, or tenv
    else if ( (window.location.hostname.indexOf("localhost") > -1) || (window.location.hostname.indexOf("highmark") > -1) || (window.location.hostname.indexOf("tenv") > -1) ) {
      clientId = testClientId;
      dataSite = testDataSite;
    } else {
      // Prod if the hostname fails all test checks
      clientId = prodClientId;
      dataSite = prodDataSite;
    }
    
    // Build the multisite client id using the client id and the site id
    var multisiteClientId = (clientId + '|' + UCD_ANALYTICS.siteId);
    var siteDomain = UCD_ANALYTICS.util.getSiteDomain();
    
    /*** COREMETRICS VENDOR SCRIPT ***/
    // EXAMPLE RESOLVED PROD: cmSetClientID('51130000|UNITEDCONCORDIA', true, 'data.coremetrics.com', 'www.unitedconcordia.com');
    // EXAMPLE RESOLVED TEST: cmSetClientID('81130000|UNITEDCONCORDIA', true, 'testdata.coremetrics.com', 'www.unitedconcordia.com');
    cmSetClientID(multisiteClientId, true, dataSite, siteDomain);
  },
  
  /**
   * Handles various other configurations of coremetrics
   */
  ucdCmOther: function() {
    if (!UCD_ANALYTICS.analyticsOn) {  return; }
    /* Appends page id to the front of the form name during form submissions, 
     * can be turned off with variable in custom namespace
     * EXAMPLE_1: www.unitedconcordia.com/dental-insurance/_signin
     * EXAMPLE_2: www.unitedconcordia.com/dental-insurance/employer/_signin */
    if (UCD_ANALYTICS.prefixFormIdWithPageId) {
      cmSetupOther({"cm_FormPageID":true});
    }
    /* cm_SkipHandlerReg turns off form and/or link tracking; Use this to not 
     * register form and link handlers. Values: "F" to not register form handlers, 
     * "L" to not register link handlers, and "FL" for both. */
    if (UCD_ANALYTICS.app.disableAutoLinkTracking) {
      cmSetupOther({"cm_SkipHandlerReg":"L"});
    }
  },

  /**
   * Creates a page view event by processing the given page and determining its page id if the pageId
   * was not passed in.  Most pages will not pass in a specific pageId and will let an algorithm 
   * determine the pageId based on the current url.
   */
  ucdCreatePageViewTag: function(pageId) {
    if (!UCD_ANALYTICS.analyticsOn) { return; }
    //determine page id
    if (!pageId) {
      //build default pageId if not passed in
      pageId = UCD_ANALYTICS.app.getPageId();
      if (!pageId) {
        //pageId could not be determined, exit the function
        return;
      }
    }
    //fire appropriate page view tag
    if (UCD_ANALYTICS.app.search && UCD_ANALYTICS.app.search.isSearchPage()) {
      //search page
      UCD_ANALYTICS.ucdCreateSearchPageViewTag(pageId);
    } else {
      //default page
      cmCreatePageviewTag(pageId, UCD_ANALYTICS.categoryId);
    }
  },
  
  /**
   * Creates a page view when you switch pages without actually changing pages. 
   * Example: next button changes the page using javascript rather than loading a new page.
   * SubPageId is appended to the current pageId based on the algorithm for determining pageIds.
   * 
   */
  ucdCreateManualPageviewTag: function(subPageId) {
    if (!UCD_ANALYTICS.analyticsOn) { return; }
    var pageId = UCD_ANALYTICS.app.getPageId();
    if (!pageId) {
      return;
    } else if (subPageId) {
      pageId += ("-" + subPageId);
    }
    //only make the manual page view tag call if it hasn't already been called for this page id
    if (!UCD_ANALYTICS.util.arrayIncludes(UCD_ANALYTICS.manualPageviewsCalled, pageId)) {
      var categoryId = UCD_ANALYTICS.app.getCategoryId(UCD_ANALYTICS.brand.categoryId, UCD_ANALYTICS.brandId);
      cmCreateManualPageviewTag(pageId, categoryId, window.location.href);
      UCD_ANALYTICS.manualPageviewsCalled.push(pageId);
    }
  },

  /**
   * To handle confusion between event (unica) and element (coremetrics) tagging.
   */
  tagElement: function(element, category) {
    UCD_ANALYTICS.tagEvent(element, category);
  },

  tagEvent: function(event, category) {
    if (!UCD_ANALYTICS.analyticsOn) { return; }
    var eventString = "";
    if (event) {
      //lowercase and remove underscores & spaces
      eventString += event.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
      if (typeof window.ntptEventTag === 'function') {
        //TODO: can be removed when unica is removed
        ntptEventTag("ev="+eventString);    
      }
      if (category) {     
        UCD_ANALYTICS.ucdCreateElementTag(eventString, category);
      } else if (UCD_ANALYTICS.app.name) {
        category = UCD_ANALYTICS.brand.name + "-" + UCD_ANALYTICS.app.name;
        UCD_ANALYTICS.ucdCreateElementTag(eventString, category);
      } else {
        UCD_ANALYTICS.ucdCreateElementTag(eventString, UCD_ANALYTICS.brand.name);
      }
    }
  },
  
  tagLink: function(link, linkName) {
    UCD_ANALYTICS.ucdCreateManualLinkClickTag(link, linkName);
  },
  
  /**
   * Accepts both string and anchor element (can be passed in using this)
   * Ex1: 
   * passing the anchor element, the link value is pulled from the href attribute
   * href="/some-page/" onclick="ucdCreateManualLinkClickTag(this, 'side-somepage');"
   * Ex2: 
   * specify the link value manually
   * href="/some-page/" onclick="ucdCreateManualLinkClickTag('/some-page/', 'side-somepage');"
   */
  ucdCreateManualLinkClickTag: function(link, linkName) {
    if (!UCD_ANALYTICS.analyticsOn) { return; }
    if (link instanceof HTMLAnchorElement) {
       link = link.getAttribute('href');
    }
    cmCreateManualLinkClickTag(link, linkName);
  },
  
  ucdCreateElementTag: function(elementId, category) {
    if (!UCD_ANALYTICS.analyticsOn) { return; }
    elementId = elementId.substring(0,50);
    if (category) {
      cmCreateElementTag(elementId, category);
    } else {
      cmCreateElementTag(elementId);
    }
  },

  ucdCreateSearchPageViewTag: function(pageId) {
    var searchQuery = UCD_ANALYTICS.app.search.getQuery();
    var searchResultsCount = UCD_ANALYTICS.app.search.getCount();
    if (searchResultsCount > 0) {
      UCD_ANALYTICS.categoryId += " SUCCESSFUL";
    } else {
      UCD_ANALYTICS.categoryId += " UNSUCCESSFUL";
    }
    cmCreatePageviewTag(pageId, UCD_ANALYTICS.categoryId, searchQuery, searchResultsCount);
  },
  
  /**
   * A registration tag will fire at the end of the page after the pageview tag on pages in
   * which the UCD_ANALYTICS.registration.isRegistrationPage() return true.  The
   * registration tag associates the Coremetrics session cookie with a user id for that
   * domain.
   */
  ucdCreateRegistrationTag: function(registrationId) {
    if (!UCD_ANALYTICS.analyticsOn || !UCD_ANALYTICS.app.registration || !UCD_ANALYTICS.app.registration.isRegistrationPage()) { 
      return; 
    }
    if (!registrationId) {
      registrationId = UCD_ANALYTICS.app.registration.getId();
    }
    if (registrationId) {
      cmCreateRegistrationTag(registrationId);
    }
  },
  
  /**
   * Function which will override the unica netinsight tags to do nothing once
   * unica is removed from UCD apps. This will prevent javascript errors on sites which contain
   * Unica tags when it is retired rather than require them to all be removed immediately.
   */
  overlayUnicaTags: function() {
    if (UCD_ANALYTICS.disableUnicaTagging) { 
      window.ntptEventTag = function() {};
      window.ntptLinkTag = function() {};
      window.ntptSubmitTag = function() {};
      window.ntptAddPair = function() {};
      window.ntptDropPair = function() {};
    }
  }
  
};

/**
 * This namespace contains utility methods used by the UCD_ANALYTICS logic
 */
UCD_ANALYTICS.util = {

  /**
   * Utility method for determining if a pathPattern exists in the pathname
   * 
   * @param pathPattern
   *  A string pattern which may or may not be contained in the pathname.
   *  EX: "/dental-insurance/home/" is contained in the pathname "/dental-insurance/home/about/"
   * @returns {Boolean}
   *  True if the pattern is in the pathname.
   *  False if the pattern is NOT in the pathname.
   */
  pathContains: function(pathPattern) {
    if (Array.isArray(pathPattern)) {
      return UCD_ANALYTICS.util.pathContainsAny(location.pathname, pathPattern);
    } else {
      return UCD_ANALYTICS.util.contains(location.pathname, pathPattern);
    }
  },
  
  arrayIncludes: function(array, string) {
    var includes = false;
    for (var index = 0; index < array.length; index++) {
      if (array[index] === string) {
        includes = true;
        break;
      }
    }
    return includes;
  },

  /**
   * Checks to see if any of the path patterns in the array match the current path
   */
  pathContainsAny: function(pathPatternArray) {
    for (var index = 0; index < pathPatternArray.length; index++) {
      if (UCD_ANALYTICS.util.pathContains(pathPatternArray[index])){
        return true;
      }
    }
    return false;
  },

  isErrorPage: function() {
    var errorPatterns = ["/404error", "/500error"];
    return UCD_ANALYTICS.util.pathContainsAny(errorPatterns);
  },

  /**
   * Utility method for determining if a hostPattern exists in the hostname
   * 
   * @param hostPattern
   *  A string pattern which may or may not be contained in the hostname.
   *  EX: "ghc-odc" is contained in the hostname "ghc.ourdentalcoverage.com"
   * @returns {Boolean}
   *  True if the pattern is in the hostname.
   *  False if the pattern is NOT in the hostname.
   */
  hostnameContains: function(hostPattern) {
    return UCD_ANALYTICS.util.contains(location.hostname, hostPattern);
  },

  contains: function(s, pattern) {
    return (s && s.indexOf(pattern) > -1);
  },

  /**
   * Attempts to grab a request parameter with the given name from the uri component
   */
  getParam: function(name) {
    name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search);
    if (name) {
      return decodeURIComponent(name[1]);
    }
  },
  
  /**
   * returns the hostname without the subDomain
   */
  getSiteDomain: function() {
    return location.hostname.substring(location.hostname.indexOf(".")+1);
  },

  /**
   * returns the subdomain removing any tenv#
   */
  getSubDomain: function() {
    var subDomain = location.hostname.substring(0, location.hostname.indexOf("."));
    if (subDomain === "www") {
      subDomain = "";
    } else if (UCD_ANALYTICS.util.contains(subDomain, "tenv")) {
      subDomain = subDomain.substring(0, subDomain.indexOf("tenv"));
    }
    return subDomain;
  },

  /**
   * Determines if running locally by looking for localhost or highmark in the 
   */
  isLocal: function() {
    return (window.location.hostname.indexOf("localhost") > -1) || (window.location.hostname.indexOf("highmark") > -1);
  },
  
  /**
   * returns the app alias which is either the app id or the pretty faces name
   * ex: 'dental-insurance' or 'ducdpw'
   */
  getAppAlias: function() {
    var appAlias = null;
    var i = location.pathname.substring(1).indexOf("/"); 
    appAlias = location.pathname.substring(1, i+1);
    return appAlias;
  },

    addEventListenerPolyFill: function(ev, el, f) {
        if (el.addEventListener) {
            el.addEventListener(ev, f);
        } else if (el.attachEvent) {
            el.attachEvent('on' + ev, f);
        }
    },

    fireFunctionOnLoad: function(f) {
        UCD_ANALYTICS.util.addEventListenerPolyFill('load', window, f);
    },

    fireFunctionOnClick: function(el, f) {
        UCD_ANALYTICS.util.addEventListenerPolyFill('click', el, f);
    }

};

function Brand(name, siteId, categoryId, siteDomain, subDomain, defaultApp) {
  //required
  this.name = name;//name of the brand used for element categorization
  this.siteId = siteId;//site id reported to in coremetrics, default for the brand
  this.categoryId = categoryId;//default category id for the brand in coremetrics
  this.siteDomain = siteDomain;//domain associated with the brand, used to determine if the current page should be associated with this brand
  
  //optional
  this.subDomain = subDomain;//subdomain associated with this brand, used to determine if the current page should be associated with this brand when set
  this.defaultApp = defaultApp;//the default app associated with the brand in the case that it cannot be determined based on the algorithm
  
  /**
   * Checks to see if the brands domain matches the current domain, if the brand has a subdomain, checks to see if the subdomain matches
   */
  this.matchesDomain = function() {
    var result = false;
    var currentSiteDomain = UCD_ANALYTICS.util.getSiteDomain();
    var currentSubDomain = UCD_ANALYTICS.util.getSubDomain();
    if (currentSiteDomain === this.siteDomain && ((!this.hasSubDomain() && !currentSubDomain) || this.subDomain === currentSubDomain)) {
      result = true;
    }
    return result;
  };
  
  this.hasSubDomain = function() {
    var result = false;
    if (typeof this.subDomain !== 'undefined' && this.subDomain) {
      result = true;
    }
    return result;
  };
}

function App(alias, brandList, name) {
  //required
  this.alias = alias;//string which matches the app alias which appears in the url ex: ducdmr for mdb
  this.brandList = brandList;//array of valid Brand Objects for this app
  this.name = name;//human readable name of the app, used for element tagging categorization

  //optional
  this.siteId = null; //only set in apps that override the brand value
  this.categoryId = null; //only set in apps that override the brand value
  this.categoryList = null;//array of Category Objects
  this.search = null;//search object
  this.registration = null;//registration object;
  this.specialPaths = null;//array of SpecialPath objects
  this.params = null;//array of request parameters expected to be included in page ids
  this.events = null;//array of on click events to be added to elements on the page on load
  this.disableAutoLinkTracking = false;//set to true if automatic link tracking should be disabled for this app (jsf reasons?)

  //not set when first built
  this.currentPageId = null;

  /**
   * Set the getPageId method.  Uses non-default method if the app expects to have 
   * parameters used as part of the page id.
   */
  this.getPageId = function() {
    if (!this.currentPageId) {
      this.setPageId();
    }
    return this.currentPageId;
  };

  this.setPageId = function(host, path) {
    if (this.params && this.params.length > 0) {
      this.currentPageId = this.getDefaultPageIdWithRequestParams(this.params, host, path);
    } else {
      this.currentPageId = this.getDefaultPageId(host, path);
    }
  };

  /**
   * Sets the Page Id to any String value.
   */
  this.setFullPageId = function(pageId) {
    this.currentPageId = pageId;
  };

  /**
   * Sets the Page Id using the default host logic and a customized path.
   */
  this.setPageIdPath = function(path) {
    this.setPageId(null, path);
  };

  /**
   * Sets the Page Id using the default path logic and a customized host.
   */
  this.setPageIdHost = function(host) {
    this.setPageId(host, null);
  };

  /**
   * Allows you to append a string to the end of the normal pageId.
   */
  this.appendPageId = function(appendString) {
    this.currentPageId = this.getPageId() + appendString;
  };

  /**
   * Builds the pageId using the host and pathname.  This removes the unneeded protocol
   * and any additional parameters from the full location value.
   * 
   * The function also checks to make sure the host and path are defined before building 
   * pageId.
   */
  this.getDefaultPageId = function(host, path) {
    var pageId = null;
    if (!host) {
      host = window.location.hostname;
    }
    if (!path) {
      path = window.location.pathname;
    }
    if (host && path) {
      //url without protocol or request params
      path = this.handleSpecialPaths(path);
      pageId = host + path;
    }
    //if host or path is undefined, pageId will be null
    return pageId;
  };
  
  /**
   * Builds the pageId using the host and pathname appending the request params passed in
   * if they are found on the request. Will always append in the given order, ensuring
   * unique page ids for pages with same path and parameters.
   */
  this.getDefaultPageIdWithRequestParams = function(params) {
    var pageId = this.getDefaultPageId();
    if (pageId && params) {
      for (var index = 0; index < params.length; index++) {
        var currentParam = params[index];
        var paramVal = UCD_ANALYTICS.util.getParam(currentParam);
        if (paramVal) {
          if (index === 0) {
            pageId += "?";
          } else {
            pageId += "&";
          }
          pageId += params[index] + "=" + paramVal;
        }
      }
    }
    return pageId;
  };

  /**
   * Default isRegistrationPage function returns false
   * override to perform real check for sites using registration tags
   */
  this.isRegistrationPage = function() {
    return false;
  };
  
  /**
   * If the path is in the apps special path list, this method should return the displayed value
   */
  this.handleSpecialPaths = function(path) {
    for (var index = 0; this.specialPaths && index < this.specialPaths.length; index++) {
      if (this.specialPaths[index].displayed === path) {
        //swap alternate reporting path
        if (this.specialPaths[index].alternate) {
          //return the designated alternate path
          path = this.specialPaths[index].alternate;
        }
        //perform special function
        if (this.specialPaths[index].specialFunction) {
          path = this.specialPaths[index].specialFunction(path);
        }
        //exit loop since the special path was processed
        break;
      }
    }
    return path;
  };

  /**
   * Gets the full category id which factors in the application, the brand, and the category
   * list containing the path patterns for the site.
   */
  this.getCategoryId = function(brandCategoryId, brandId) {
    var categoryId = this.getBaseCategoryId(brandCategoryId);// brand category id
    var specialCategory = this.getSpecialPageCategory();// ex: ERROR or SEARCH
    if (categoryId && specialCategory) {
      // Combine base and special
      categoryId += ":" + specialCategory;
    } else if (categoryId) {
      // Determine category id using category list
      if (this.categoryList && this.categoryList.length > 0) {
        var appPageCategory = this.getAppPageCategory(brandId);
        if (appPageCategory === null) { 
          // failed category processing if null
          categoryId = null; 
        } else if (appPageCategory !== "") {
          // combine base and page category ids 
          categoryId += ":" + appPageCategory;
        } else if (appPageCategory === "") { 
          // do nothing if no appPageCategory found, category returned is base only
        }
      }
    }
    return categoryId;
  };

  this.getBaseCategoryId = function(brandCategoryId) {
    var baseCategoryId = null;
    //if the app has a category id, we MAY want to combine it with the brand id
    if (this.categoryId) {
      //if there is only one brand on the app, we can just use the app's category id for the base id
      if (this.brandlist && this.brandList.length > 1) {
        //only append the default category id if current app has more than one brand associated with it
        //EX: 'MDB:SLF'
        baseCategoryId = ( this.categoryId + ":" + brandCategoryId );
      } else {
        //EX: 'CLIENTSCORNER'
        baseCategoryId = this.categoryId;
      }
    } else {
      //use the brand's base category id by default
      //EX: 'LSV'
      baseCategoryId = brandCategoryId;
    }
    return baseCategoryId;
  };

  //default search and error categories
  this.getSpecialPageCategory = function() {
    var specialPageCategory = null;
    if (UCD_ANALYTICS.util.isErrorPage()) {
      //default error page category
      specialPageCategory = "ERROR";
    } else if (this.search && this.search.isSearchPage()) {
      //default search page category
      specialPageCategory = "SEARCH";
    }
    return specialPageCategory;
  };

  //app specific categories (may overwrite above default categories)
  this.getAppPageCategory = function(brandId) {
    var pageCategoryId = "";
    for (var index = 0; this.categoryList && index < this.categoryList.length; ++index) {
      //find current category in list
      if (this.categoryList[index].isCurrentCategory()) {
        if (this.categoryList[index].isExcluded(brandId)) {
          //category is invalid for this brand, page will be excluded from reports
          pageCategoryId = null;
        } else {
          pageCategoryId = ( this.categoryList[index].name );
        }
        break;
      }
    }
    return pageCategoryId;
  };

  /**
   * Brand valid for an app if the brand is included in the brand list
   */
  this.isBrandValid = function(brandId) {
    return UCD_ANALYTICS.util.arrayIncludes(brandList, brandId);
  };

  this.fireOnLoad = function() {
    //should be overridden by app if needed
  };

}

function Category(name, pathPattern, excludedBrands) {
  this.name = name;
  this.pathPattern = pathPattern;
  //list of brands that are excluded from reporting the category
  if (excludedBrands) {
    this.excludedBrands = excludedBrands;
  } else {
    this.excludedBrands = [];
  }

  this.isCurrentCategory = function() {
    return UCD_ANALYTICS.util.pathContains(this.pathPattern);
  };

  /**
   * Indicates whether the category is excluded from the given brand's reports and should
   * therefore be excluded from reports.
   * If excluded brands contains "all" then the category will always be excluded.
   * True if brand is listed in the excludedBrands list
   * False if brand is not included in the excludedBrands list
   */
  this.isExcluded = function(brandId) {
    return UCD_ANALYTICS.util.arrayIncludes(this.excludedBrands, 'all') || UCD_ANALYTICS.util.arrayIncludes(this.excludedBrands, brandId);
  };

}

/**
 * Special Paths are to be used when one url path should be reported as another.
 * Example: '/fedvip/' should be reported as '/fedvip/home/'
 *          new SpecialPath('/fedvip/', '/fedvip/home/');
 */
function SpecialPath(displayedPath, alternatePath, specialFunction) {
  this.displayed = displayedPath;
  this.alternate = alternatePath;
  this.specialFunction = specialFunction;
}

/**
 * Object passed to an app to encapsulate that apps search tagging behavior
 */ 
function Search(searchPath, countInputId, queryInputId) {
  this.searchPath = searchPath;
  this.countInputId = countInputId;
  this.queryInputId = queryInputId;
  /**
   * Function for determining if the current page is the search page 
   * Default implementation looks for a pathPattern
   */
  this.isSearchPage = function() {
    return UCD_ANALYTICS.util.pathContains(this.searchPath);
  };
  /**
   * Function for determining how many results there were on the search page 
   * Default implementation grabs the value from an input using jQuery
   */
  this.getCount = function() {
    return $(countInputId).val();
  };
  /**
   * Function for determining the query string on the search page 
   * Default implementation grabs the value from an input using jQuery
   */
  this.getQuery = function() {
    return $(queryInputId).val();
  };
}

/**
 * Object passed to an app to encapsulate that apps registration tagging behavior
 */
function Registration(registrationPath, regIdInput) {
  this.registrationPath = registrationPath;
  this.regIdInput = regIdInput;
  /**
   * Function for determining if the current page contains registration info
   * Default implementation looks for a pathPattern 
   */
  this.isRegistrationPage = function() {
    return UCD_ANALYTICS.util.pathContains(this.registrationPath);
  };
  /**
   * Function for retrieving registration info from the page
   * Default implementation grabs the value from an input using jQuery
   */
  this.getId = function() {
    return $('#'+regIdInput).val();
  };
}

//Begin polyfills - DO NOT EDIT - recommend collapsing this in editor
//SRC: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
//End polyfills

//initializes analytics page and link tracking
UCD_ANALYTICS.init();