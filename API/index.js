main();
async function main() {
    console.log("APP initialized");
    const buttonSelect = document.getElementById("buttonSelect");
    buttonSelect?.addEventListener("click", async () => await openUploadFile());
}

async function openUploadFile(accept = ".jpg,.jpeg,.png,.gif") {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = accept;
    fileInput.style.display = "none";
    fileInput.onchange = eventselectFile;
    document.body.appendChild(fileInput);
    fileInput.click();
    await new Promise(r => setTimeout(r, 1000));
    document.body.removeChild(fileInput);
}

async function eventselectFile(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected");
        return;
    }
    console.log("File selected:", file);
    await uploadFile(file);
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append("archivo", file);
    try {
        const response = await fetch("./upload", {
            method: "POST",
            body: formData,
        });
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error("Error uploading file:", error);
    }

}