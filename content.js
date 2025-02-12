setTimeout(() => {
  let contentElement = document.querySelector("#cms-navigation-1 .col.col-12.col-md-9"); // Placeholder for user-defined selector
  let materialCode = window.location.pathname.split("/").pop();

  let overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.bottom = "20vh";
  overlay.style.left = "50vw";
  overlay.style.background = "gray";
  overlay.style.padding = "5px";
  overlay.style.border = "1px solid black";
  overlay.style.fontSize = "2rem"
  overlay.textContent = "Not scraped; " + (contentElement ? "has content" : "no content");
  document.body.appendChild(overlay);

  chrome.storage.local.get("materials", (data) => {
    if (!data.materials) return;
    const material = data.materials.find(m => m.code === materialCode)

    if (!material) return
    if (!material.content) return;

    overlay.style.background = "green";
    overlay.textContent = "Scraped";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "s" && contentElement) {
      let scrapedData = contentElement.innerHTML;
      chrome.runtime.sendMessage({ action: "saveMaterial", material: { code: materialCode, content: scrapedData } }, () => {
        overlay.style.background = "green";
        overlay.textContent = "Scraped";
        alert("Scraped: " + scrapedData);
      });
    } else if (event.key === "n") {
      chrome.runtime.sendMessage({ action: "getMaterials" }, (materials) => {
        let index = materials.findIndex(m => m.code === materialCode);
        if (index !== -1 && index + 1 < materials.length) {
          window.location.href = `/mata-kuliah/${materials[index + 1].code}`;
        }
      });
    } else if (event.key === "Enter" && contentElement) {
      let scrapedData = contentElement.innerHTML;
      chrome.runtime.sendMessage({ action: "saveMaterial", material: { code: materialCode, content: scrapedData } }, () => {
        overlay.style.background = "green";
        overlay.textContent = "Scraped";
        chrome.runtime.sendMessage({ action: "getMaterials" }, (materials) => {
          let index = materials.findIndex(m => m.code === materialCode);
          if (index !== -1 && index + 1 < materials.length) {
            window.location.href = `/mata-kuliah/${materials[index + 1].code}`;
          }
        });
      });
    }
  });
}, 200);
