/**
 * 
 * @param {string} requestMethod GET|POST|PUT|DELETE...
 * @param {string} url API endpoint
 * @param {object} body request body
 * @param {function} onLoad function to call on success 
 * @param {function} onError function to call on error
 */
const APIRequest = (
    requestMethod, url,
    body = null,
    onLoad = () => alert("OK"),
    onError = () => alert("Error!")
) => {

    let request = new XMLHttpRequest();

    if (requestMethod == 'GET') { // if GET;transfer the body to the url
        url += '?';

        for (let key in body)
            url += key + "=\"" + body[key] + "\"&";
    }

    //console.log(url);

    request.open(requestMethod, url);
    //request.setRequestHeader("Authorization", "Basic " + btoa(`${user.username}:${user.password}`));
    request.send(JSON.stringify(body));

    request.onerror = onError;
    request.ontimeout = onError;

    request.addEventListener("load", () => {
        if (request.status < 400)
            onLoad(request.response);
        else onError(request);
    });
}

/**
 * 
 * @param {string} key
 * @returns value 
 */
const $_GET = (key) => {

    let wls = window.location.search.substring(1).replaceAll("%20", " ");
    for (let pair of wls.split('&')) {
        if (pair.startsWith(key + "=")) return pair.replace(key + "=", "");
    }

    return null;
}

export { APIRequest, $_GET };