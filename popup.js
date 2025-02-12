document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#materialsTable tbody");
  const exportButton = document.querySelector("#exportJson");
  const importButton = document.querySelector("#importJson");

  exportButton.onclick = () => {
    chrome.storage.local.get(["materials"], (data) => {
      let materials = data.materials || [];
      let json = JSON.stringify(materials);
      let blob = new Blob([json], { type: "application/json" });
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "materials.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  importButton.onclick = () => {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = () => {
      let file = fileInput.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        let json = reader.result;
        let materials = JSON.parse(json);
        chrome.storage.local.set({ materials }, () => {
          location.reload();
        });
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

  chrome.storage.local.get(["materials"], (data) => {
    let materials = data.materials || [];
    let materialsIndexed = materials.reduce((acc, material, index) => {
      if (material.content) acc[material.code] = true;
      return acc;
    }, {})

    // Get active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      let currentUrl = tabs[0].url;
      let currentCode = currentUrl.split("/").pop(); // Extract the code from the URL

      tableBody.innerHTML = "";
      materials.forEach((material, index) => {
        let row = document.createElement("tr");

        let idxTd = document.createElement("td");
        let codeTd = document.createElement("td");
        let actionsTd = document.createElement("td")

        idxTd.textContent = index + 1;
        codeTd.textContent = material.code;

        if (materialsIndexed[material.code]) {
          codeTd.style.fontWeight = "bold";
          codeTd.style.color = "green";
        } else {
          codeTd.style.color = "red";
        }

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          chrome.storage.local.get(["materials"], (data) => {
            let materials = data.materials || [];
            let updatedMaterials = materials.map((m) => m.code === material.code ? { code: m.code } : m);
            chrome.storage.local.set({ materials: updatedMaterials });
            window.location.reload();
          });
        });

        let openButton = document.createElement("button");
        openButton.textContent = "Open";
        openButton.addEventListener("click", () => {
          chrome.tabs.create({ url: 'https://ums.ac.id/mata-kuliah/' + material.code });
        });

        actionsTd.appendChild(deleteButton);
        actionsTd.appendChild(openButton);

        row.appendChild(idxTd);
        row.appendChild(codeTd);
        row.appendChild(actionsTd);

        // Highlight row if the material is currently open
        if (material.code === currentCode) {
          row.style.backgroundColor = "#ffd700"; // Yellow highlight
        }

        tableBody.appendChild(row);
      });
    });
  });
});
