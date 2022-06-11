const createOptions = () => {
  const name = chrome.i18n.getMessage("name");
  const optionsTemplate = `
    <header>
      <br>
      <img src="../../images/logo-white.svg" alt="logo" width="50px">
      <h3>${name}</h3>
    </header>
    <main>
      <form id="mainForm" name="mainForm">
        <p>
          <aside>
            <img 
              src="../../images/detect_alert_image.png"
              alt="image"
            >
          </aside>
          <label>${chrome.i18n.getMessage("options_form_1")}</label>
          <br>
          <label>
            <input type="radio" name="enabledDetectAlert" value="enabled">
            ${chrome.i18n.getMessage("options_form_1_selection_1")}
          </label>
          <br>
          <label>
            <input type="radio" name="enabledDetectAlert" value="disabled">
            ${chrome.i18n.getMessage("options_form_1_selection_2")}
          </label>
        </p>
        <p>
          <button type="submit">${chrome.i18n.getMessage("save")}</button>
        </p>
      </form>
    </main>
    <footer>
      <p>
        "${name}"${chrome.i18n.getMessage("license")}
      </p>
    </footer>
    <div id="alert">${chrome.i18n.getMessage("saved")}</div>
  `;
  document.body.innerHTML = optionsTemplate;
  document.title = name;

  chrome.storage.sync.get(["enabledDetectAlert"], data => {
    const form = document.mainForm.enabledDetectAlert;
    const defaultNode = data.enabledDetectAlert ? 0 : 1;
    form[defaultNode].checked = true;
  });

  const savedAlert = () => {
    const savedAlert = document.getElementById("alert");
    savedAlert.className = "show";
    setTimeout(() => {
        savedAlert.className = savedAlert.className.replace("show", "");
    }, 3000);
  }

  const formOnSubmitEventHandler = (event) => {
    event.preventDefault();
    const enabledDetectAlertData = event.target.enabledDetectAlert;
    const result = enabledDetectAlertData.value == "enabled" ? true : false;
    chrome.storage.sync.set({enabledDetectAlert: result});
    savedAlert();
  }
  const form = document.mainForm;
  form.addEventListener("submit", formOnSubmitEventHandler);
}

document.addEventListener("DOMContentLoaded", createOptions);