var previousURL = null;
var nextURL = null;
const page = {
    lang: "",
    excludeSearchURL: `${location.origin}${location.pathname}?`,
    search: new URLSearchParams(location.search),
}

const tryDetectPagination = () => {
    const paginationDOMs = [
        document.querySelector(".pagination"),
        document.querySelector(".index-navigator"),
        document.querySelector(".PageNavi"),
    ];
    for (let dom of paginationDOMs){
        if (dom) return dom;
    }
    return null;
}

const tryDetectQueryStringPaginationPattern = (paginationTags) => {
    const detectPatterns = ["p", "page"];
    const searchPattern = (urlSearch) => {
        const searchParam = new URLSearchParams(urlSearch);
        for (let pattern of detectPatterns) {
            if (searchParam.get(pattern) != null) return pattern;
        }
    }
    if (paginationTags) {
        for (let atag of paginationTags) {
            const queryStringPaginationPattern = searchPattern(atag.search);
            if (queryStringPaginationPattern) return queryStringPaginationPattern;
        }
    } else {
        const queryStringPaginationPattern = searchPattern(location.search);
        if (queryStringPaginationPattern) return queryStringPaginationPattern;
    }
    return null;
}

const tryDetectURLPaginationPattern = () => {

}

const attachDetectQueryStringPaginationPattern = (queryString) => {
    const searchParam = new URLSearchParams(location.search);
    const pageNum = searchParam.get(queryString);
    if (pageNum === null || pageNum == "0" || pageNum == "1") {
        page.search.set(queryString, 2);
        previousURL = null;
        nextURL =　page.excludeSearchURL + page.search.toString();
    } else {
        page.search.set(queryString, Number(pageNum) - 1);
        previousURL = page.excludeSearchURL + page.search.toString();
        page.search.set(queryString, Number(pageNum) + 1)
        nextURL = page.excludeSearchURL + page.search.toString();
    }
}

const main = () => {
    const paginationDOM = tryDetectPagination();
    let queryString = tryDetectQueryStringPaginationPattern();
    if (paginationDOM === null && queryString === null) return;
    
    if (paginationDOM) {
        const paginationTags = paginationDOM.getElementsByTagName("a");
        queryString = tryDetectQueryStringPaginationPattern(paginationTags);
    }
    if (queryString === null) return;

    attachDetectQueryStringPaginationPattern(queryString);

    if (previousURL || nextURL) {
        chrome.runtime.sendMessage({setIcon: "detected"}, res => {});
        return true;
    } else {
        chrome.runtime.sendMessage({setIcon: "notdetected"}, res => {});
    }
}
main();

const movePage = (url) => {
    if (url === null && !url) return;
    location.href = url;
}

document.addEventListener("keydown", event => {
    if (event.key == "ArrowLeft"){
        movePage(previousURL);
    } else if (event.key == "ArrowRight") {
        movePage(nextURL);
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.popup === "getIsDetected") {
            if (previousURL || nextURL) {
                sendResponse(true);
            } else {
                sendResponse(false);
            }
        }
    }
);