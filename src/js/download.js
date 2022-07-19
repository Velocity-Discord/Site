const downloadButton = document.getElementById("hero-download-button");

const getCurrentPlatform = () => {
    if (navigator.userAgent.indexOf("Mac") > -1) {
        return "mac";
    } else if (navigator.userAgent.indexOf("Linux") > -1) {
        return "linux";
    } else if (navigator.userAgent.indexOf("Win") > -1) {
        return "win";
    } else {
        return null;
    }
};

const currentPlatform = getCurrentPlatform();

fetch("https://api.github.com/repos/Velocity-Discord/Installer/releases").then(async (res) => {
    window.releases = await res.json();
    const version = window.releases[0].tag_name;

    switch (currentPlatform) {
        case "mac":
            downloadButton.innerHTML = downloadButton.innerHTML.replace("Install", `Download`);
            downloadButton.setAttribute("download", true);
            downloadButton.setAttribute("href", `https://github.com/Velocity-Discord/Installer/releases/download/${version}/Velocity_Installer-Mac.zip`);
            break;
        case "win":
            downloadButton.innerHTML = downloadButton.innerHTML.replace("Install", `Download`);
            downloadButton.setAttribute("download", true);
            downloadButton.setAttribute("href", `https://github.com/Velocity-Discord/Installer/releases/download/${version}/Velocity_Installer-Windows.exe`);
            break;
    }
});
