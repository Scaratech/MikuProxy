const settingsOverlay = document.getElementById("settings-overlay");
const settingsIcon = document.getElementById("settings-icon");
const saveSettingsBtn = document.getElementById("save-settings");
const closeSettingsBtn = document.getElementById("close-settings");
const wispCustomUrl = document.getElementById("wisp-custom-url");

function loadSettings() {
    document.querySelector(`input[name="core"][value="${getcore()}"]`).checked = true;
    document.querySelector(`input[name="transport"][value="${getTransport()}"]`).checked = true;

    const savedWispUrl = localStorage.getItem("wisp-url");

    if (savedWispUrl && savedWispUrl !== defaultWispUrl) {
        document.querySelector('input[name="wisp"][value="custom"]').checked = true;
        wispCustomUrl.value = savedWispUrl;
    } else {
        document.querySelector('input[name="wisp"][value="default"]').checked = true;
    }
}

function saveSettings() {
    localStorage.setItem("core", document.querySelector('input[name="core"]:checked').value);
    localStorage.setItem("transport", document.querySelector('input[name="transport"]:checked').value);

    const selectedWispType = document.querySelector('input[name="wisp"]:checked').value;

    if (selectedWispType === "custom") {
        const customUrl = wispCustomUrl.value.trim();

        if (customUrl) {
            localStorage.setItem("wisp-url", customUrl);
        } else {
            localStorage.removeItem("wisp-url");
        }
    } else {
        localStorage.removeItem("wisp-url");
    }
}

const showSettings = () => {
    settingsOverlay.style.display = "flex";
    loadSettings();
};

const hideSettings = () => {
    settingsOverlay.style.display = "none";
};

settingsIcon.addEventListener("click", showSettings);
closeSettingsBtn.addEventListener("click", hideSettings);
saveSettingsBtn.addEventListener("click", () => {
    saveSettings();
    hideSettings();
});

settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) hideSettings();
});

document.querySelectorAll('input[name="wisp"]').forEach(radio => {
    radio.addEventListener("change", () => {
        wispCustomUrl.disabled = radio.value !== "custom";
        if (radio.value === "custom") wispCustomUrl.focus();
    });
});

loadSettings();
