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

export { $_GET };