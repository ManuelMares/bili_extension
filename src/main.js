

/*
    Entry point for the extension
*/
async function StartExtension(){
    await loadLogoVerificationContainers();
    DetectLinkHovered();
}


/*
    Given a new link, the variable is validated and updated
    @param newLink
        The new value
*/
function UpdateCurrentLink(newLink){
    //if link is the same one, avoid reprint of validation
    // console.log("newLink given: ", newLink, CURRENTlINK, newLink === CURRENTlINK)
    if(newLink === CURRENTlINK)
    {
        return;
    }
    
    CURRENTlINK = newLink;
    let domain = extractRootDomain(CURRENTlINK);
    // console.log(domain)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
        "domain": domain
    });
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    fetch("https://cloudflare-dns.com/dns-query?name=default._bimi." + domain + "&type=TXT", {
        headers: {
            'accept': 'application/dns-json'
        }
    })
    // fetch(BIMI_API_LINK, requestOptions)
        .then(response => 
            {
                if(response.status === 400){
                    throw new Error(`HTTP error ${response.status}`);
                }
                if(response.ok){
                    return response.text()
                    
                }
            }
        )
        .then(result => {
            return JSON.parse(result)

        }) 
        .then((res)=>{
            let a = res.Answer[0].data;
            let logo = a.split(";")[1].slice(2);
            showLogotype(logo, domain);
        })
        .catch(
            error => {
            }
        );
}


async function showLogotype(svg, domain){
    if(svg == "" || document.getElementById("bili-container"))
        return;
    
    let tag = await getHTML('src/templates/bili-containers.html', _EXTENSION_ID);
    document.body.appendChild( tag );
    document.getElementById(LEFTCONTAINER_IMAGE).src = svg;
    document.getElementById(LEFTCONTAINER_LABEL).innerHTML = domain;
    

    await delay(2500)
    tag.remove();
}


/*
    This function listens for the mouse to hover over a link
    When done, it will trigger 
*/
function DetectLinkHovered(){
    document.addEventListener("mouseover",  (e)=>{
        const aTag = e.target.closest('a');

        if(!aTag)
            //If no link is detected
            UpdateCurrentLink("");
        else
            //if link is detected
            UpdateCurrentLink(aTag.href);
    })
}

/*
    Two container are created to show that a logotype was verified

    All links verification appear in container 1.
    When the link is hidden under container 1, container 2 will be used
*/
async function loadLogoVerificationContainers(){
    document.body.appendChild( await getCSS("src/templates/bili-containers.css") );
    // document.body.appendChild( await getHTML('src/templates/bili-containers.html', _EXTENSION_ID) );

}





















function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// Warning: you can use this function to extract the "root" domain, but it will not be as accurate as using the psl package.
function extractRootDomain(url) {
    var domain = extractHostname(url),
    splitArr = domain.split('.'),
    arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

