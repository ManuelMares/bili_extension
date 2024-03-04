/* 
No further code is executed until the timer if done
It can be await (async) or it can be handled as a promise

@param timeMs
    An integer indicating the time to wait for in ms
*/
const delay = (timeInMs) => {
    return new Promise(resolve => {    
        setTimeout(function() {
        resolve();
        }, timeInMs)
    });
}


/* 
This function waits until an HTML element exists, and returns the object in a promise when that happens
All process will stop until the element exists

@param selector
    A selector property from the element to wait for
*/
function asyncQuery(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}



/*
Dynamically retrieves and prepares a LOCAL html file. The indicated file must be listed as a web accessible resource.

@param dir
    The location of the LOCAL html file
@param extensionId
    The global variable that contains the extension id

NOTE:
    When the html uses a local image, the image can be accessed as:
        src="chrome-extension://EXTENSION_ID/icons/logotype.svg"
    To achieve a dynamical load of images, the EXTENSION_ID substring is substituted for a variable with the exact same name.
    Therefore, the passed variable 'extensionId' 

usage: 
    --global variable: 
        _MY_EXTENSION_ID = chrome.runtime.id;

    --script that loads the html file
    let container = document.createElement('div');
    container.innerHTML = await getTextContent('templates/form.html', _MY_EXTENSION_ID);
    
    --templates/form.html
    <img src="chrome-extension://EXTENSION_ID/icons/logotype.svg"/>
*/
async function getHTML(dir, extensionId){  
    return fetch(chrome.runtime.getURL(dir))
    .then((resp) => { return resp.text(); })
    .then((content) => { 
        //updating extension Id
        content = content.replaceAll("EXTENSION_ID", extensionId);

        //Unlike, css, it is necessary to wrap the html in a container
        let container = document.createElement('div');
        container.innerHTML = content;
        
        return  container;
    });
}


/*
Dynamically retrieves and prepares a LOCAL css file. The indicated file must be listed as a web accessible resource.

@param cssDir
    The location of the LOCAL file

usage: 
    container.appendChild( await getCSS('src/styles.css') );   
*/
async function getCSS(cssDir){
    return fetch(chrome.runtime.getURL(cssDir))
    .then((resp) => { return resp.text(); })
    .then((content) => { 
        var style = document.createElement( 'style' );
        style.innerHTML = content
        return  style;
    });
}


function checkValidJSON(param) {
return !(Object.keys(param).length === 0);
}



function getDate_YYYYMMDD(){
    //months and days start on 0
    let date = new Date()
    let year = date.getFullYear();
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getDate()
    return   year + "/" + month + "/" + day; 
}


/*
Deletes the HTML node given an id
*/
function removeHTMLNode_byId(id){
    document.getElementById(id).outerHTML = "";
}


function removeHTMLNode(selector){
if(elementExists(selector)){
    document.querySelector(selector).remove();
}

if(elementExists(selector))
    document.querySelector(selector).outerHTML = "";

//In case in needs TrustedHTML assignment
}



function elementExists(query){
    let el = document.querySelector(query);
    if(!el)
        return false;
    return true;
}
function isValidHTML(node){
    if(node == null)
        return false;
    return true;
}


