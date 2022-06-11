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
        document.querySelector(".s-pagination-strip"),
    ];
    for (let dom of paginationDOMs){
        if (dom) return dom;
    }
    return null;
}

const tryDetectQueryStringPaginationPattern = (paginationTags) => {
    /* 
        If there are paginationTags, 
        it tries to detect them based on the information in the tags. 
        If not, it refers to the current URL.
    */
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
    // To be addressed in the future
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

const movePage = (url) => {
    if (url === null && !url) return;
    location.href = url;
}

const keydownEventHandler = (event) => {
    if (event.key == "ArrowLeft"){
        movePage(previousURL);
    } else if (event.key == "ArrowRight") {
        movePage(nextURL);
    }
}

const runtimeOnMessagehandler = (request, sender, sendResponse) => {
    if(request.popup === "getIsDetected") {
        if (previousURL || nextURL) {
            sendResponse(true);
        } else {
            sendResponse(false);
        }
    }
}

const paginationDetectHandler = (response) => {
    chrome.storage.sync.get(["enabledDetectAlert"], data => {
        if (!data.enabledDetectAlert) return;
        const detectAlert = document.getElementById("alert");
        detectAlert.className = "show";
        setTimeout(() => {
            detectAlert.className = detectAlert.className.replace("show", "");
        }, 3000);
    });
}

const init = () => {
    const snackBar = document.createElement('div');
    snackBar.setAttribute("id", "alert");
    snackBar.textContent = chrome.i18n.getMessage("detect_alert");
    document.body.appendChild(snackBar);
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
        chrome.runtime.sendMessage({setIcon: "detected"}, paginationDetectHandler);
        return true;
    } else {
        chrome.runtime.sendMessage({setIcon: "notdetected"}, res => {});
    }
}
init();
main();

document.addEventListener("keydown",keydownEventHandler);
chrome.runtime.onMessage.addListener(runtimeOnMessagehandler);