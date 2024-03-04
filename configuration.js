/*
    This file is the entry point for the application.
    It loads the global variables and triggers the initial functions
*/

//This global variable retrieves the extension id
//It is used to load local images correctly
let _EXTENSION_ID               = chrome.runtime.id;
//indicates the current link hovered
let CURRENTlINK                 = "";
let BIMI_API_LINK               = "https://cloudflare-dns.com/dns-query?name=";
// let BIMI_API_LINK               = "https://beta.emaildojo.io/tool-bimi/check-bimi";
const LEFTCONTAINER             = "bili-leftContainer";
const RIGHTCONTAINER            = "bili-rightContainer";
const LEFTCONTAINER_IMAGE       = "bili-leftContainer-image";
const RIGHTCONTAINER_IMAGE      = "bili-rightContainer-image";
const LEFTCONTAINER_LABEL       = "bili-leftContainer-label"
const RIGHTCONTAINER_LABEL      = "bili-rightContainer-label"


//entry point for the app
StartExtension();