const createPopup = () => {
  document.body.innerHTML = `
    <div id="app">
      <div class="header">
        <img class="header__logo" src="../../images/logo-blue.svg" alt="" width="40">
        <h2 class="title">${chrome.i18n.getMessage("name")}</h2>
      </div>
      <div class="main">
        <p id="status"></p>
        <p id="navigate"></p>
        <div class="report-card">
          <div>${chrome.i18n.getMessage("report")}</div>
          <a 
            id="form-link"
            target="_blank"
            href=""
          >
            <div class="report-card__box">
              ${chrome.i18n.getMessage("do_report")}🌱
            </div>
          </a>
        </div>
      </div>
    </div>
  `;
  
  const setDetectedText = (isDetected) => {
    const statusDOM = document.getElementById("status");
    const statusText = isDetected ? chrome.i18n.getMessage("detected") : chrome.i18n.getMessage("notdetected");
    statusDOM.innerHTML = chrome.i18n.getMessage("status") + ": " + statusText;

    const navigate = document.getElementById("navigate");
    navigate.innerHTML = isDetected ? chrome.i18n.getMessage("navigate") + "👩‍🎤" : "🙈";
  };

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const formLinkDOM = document.getElementById("form-link");
    const link = chrome.i18n.getMessage("form_url") + encodeURIComponent(tabs[0].url);
    formLinkDOM.href = link;

    chrome.tabs.sendMessage(
      tabs[0].id,
      {popup: "getIsDetected"},
      setDetectedText,
    )
  });
}
document.addEventListener("DOMContentLoaded", createPopup);