const setDetectedIcon = (sender) => {
    chrome.action.setIcon({
        path: {
            "16": chrome.runtime.getURL("images/detected/icon_16.png"),
            "32": chrome.runtime.getURL("images/detected/icon_32.png"),
            "48": chrome.runtime.getURL("images/detected/icon_48.png"),
            "128": chrome.runtime.getURL("images/detected/icon_128.png"),
        },
        tabId: sender.tab.id
    });
}

const setDefaultIcon = (sender) => {
    chrome.action.setIcon({
        path: {
            "16": chrome.runtime.getURL("images/default/icon_16.png"),
            "32": chrome.runtime.getURL("images/default/icon_32.png"),
            "48": chrome.runtime.getURL("images/default/icon_48.png"),
            "128": chrome.runtime.getURL("images/default/icon_128.png"),
        },
        tabId: sender.tab.id
    });
}

const scriptsRuntimeOnMessageHandler = (request, sender, sendResponse) => {
    if(request.setIcon === "detected"){
        setDetectedIcon(sender);
        sendResponse({status: "ok"});
        return;
    }
    
    if (request.setIcon === "notdetected") {
        setDefaultIcon(sender);
        sendResponse({status: "ok"});
        return;
    }
    
    sendResponse({status: "this event not registered"});
}

const onInstalledHandler = () => {
    const enabledDetectAlert = false;
    chrome.storage.sync.set({enabledDetectAlert: enabledDetectAlert});
}

chrome.runtime.onInstalled.addListener(onInstalledHandler);
chrome.runtime.onMessage.addListener(scriptsRuntimeOnMessageHandler);