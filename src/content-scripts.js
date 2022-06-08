var previousURL = null;
var nextURL = null;
var page = {
    search: new URLSearchParams(location.search),
    queryString: null,
}

const tryDetectPagination = () => {
    const paginationDOMs = [
        document.querySelector(".pagination"),
        document.querySelector(".index-navigator"),
        document.querySelector(".PageNavi"),
    ];
    for(let dom of paginationDOMs){
        console.log(dom);
        if(dom) return dom;
    }
    return null;
}

const tryDetectQueryStringPaginationPattern = (paginationTags) => {
    const detectPatterns = ["p", "page"];
    for(let atag of paginationTags) {
        const searchParam = new URLSearchParams(atag.search);
        for(let pattern of detectPatterns) {
            console.log(searchParam.get(pattern));
            if(searchParam.get(pattern) != null) return pattern;
        }
    }
    return null;
}

const tryDetectURLPaginationPattern = () => {

}

const main = () => {
    const paginationDOM = tryDetectPagination();
    if(paginationDOM === null) return;

    const paginationTags = paginationDOM.getElementsByTagName("a");
    console.log(paginationTags);
    page.queryString = tryDetectQueryStringPaginationPattern(paginationTags);
    if(page.queryString === null) return;

    const searchParam = new URLSearchParams(location.search);
    const pageNum = searchParam.get(page.queryString);
    if (pageNum === null || pageNum == "0" || pageNum == "1") {
        page.search.set(page.queryString, 2);
        previousURL = null;
        nextURL = page.search.toString();
    } else {
        page.search.set(page.queryString, Number(pageNum) - 1);
        previousURL = page.search.toString();
        page.search.set(page.queryString, Number(pageNum) + 1)
        nextURL = page.search.toString();
    }

    console.log(encodeURIComponent(previousURL), encodeURIComponent(nextURL));
    if (previousURL || nextURL) {
        chrome.runtime.sendMessage({setIcon: "detected"}, res => console.log(res.status));
    } else {
        chrome.runtime.sendMessage({setIcon: "notdetected"}, res => console.log(res.status));
    }
}
main();

const movePage = (url) => {
    if (url === null && !url) return;
    const transitionURL = `${location.origin}${location.pathname}?` + url;
    location.href = transitionURL;
}

document.addEventListener("keydown", event => {
    if (event.key == "ArrowLeft"){
        movePage(previousURL);
    } else if (event.key == "ArrowRight") {
        movePage(nextURL);
    }
})