const theMaterialCodes = [
  { code: "TIF3221104" },
  { code: "TIF3221303" },
  { code: "TIF1221202" },
  { code: "TIF1221201" },
  { code: "TIF3221308" },
  { code: "TIF3221206" },
  { code: "TIF3221305" },
  { code: "TIF3221307" },
  { code: "TIF3221311" },
  { code: "TIF3221312" },
  { code: "TIF3221113" },
  { code: "TIF3221315" },
  { code: "TIF3221316" },
  { code: "TIF3221117" },
  { code: "TIF1221209" },
  { code: "TIF1221210" },
  { code: "TIF3221314" },
  { code: "TIF3221324" },
  { code: "TIF1221265" },
  { code: "TIF1221218" },
  { code: "TIF3221325" },
  { code: "TIF3221322" },
  { code: "TIF3221321" },
  { code: "TIF3221120" },
  { code: "TIF3221319" },
  { code: "TIF3221123" },
  { code: "TIF3221334" },
  { code: "TIF1221227" },
  { code: "TIF1221226" },
  { code: "TIF3221235" },
  { code: "TIF3221133" },
  { code: "TIF3221332" },
  { code: "TIF3221131" },
  { code: "TIF3221330" },
  { code: "TIF3221129" },
  { code: "TIF3221328" },
  { code: "TIF3221356" },
  { code: "TIF3221349" },
  { code: "TIF3221348" },
  { code: "TIF3221347" },
  { code: "TIF3221146" },
  { code: "TIF3221345" },
  { code: "TIF3221344" },
  { code: "TIF3221342" },
  { code: "TIF3221341" },
  { code: "TIF3221340" },
  { code: "TIF3221339" },
  { code: "TIF3221338" },
  { code: "TIF3221237" },
  { code: "TIF3221336" },
  { code: "TIF3221343" },
  { code: "TIF3221358" },
  { code: "TIF3221357" },
  { code: "UMS1221251" },
  { code: "TIF1221250" },
  { code: "TIF3221364" },
  { code: "TIF3221163" },
  { code: "TIF3221362" },
  { code: "TIF3221161" },
  { code: "TIF3221360" },
  { code: "TIF3221159" },
  { code: "TIF3221355" },
  { code: "TIF3221354" },
  { code: "TIF3221353" },
  { code: "TIF3221352" },
  { code: "TIF3221268" },
  { code: "TIF2221266" },
  { code: "TIF3221270" },
  { code: "TIF3221367" },
  { code: "TIF3221269" },
  { code: "TIF3221371" },
  { code: "TIF3221389" },
  { code: "TIF3221388" },
  { code: "TIF3221387" },
  { code: "TIF3221386" },
  { code: "TIF3221385" },
  { code: "TIF3221384" },
  { code: "TIF3221383" },
  { code: "TIF3221382" },
  { code: "TIF3221381" },
  { code: "TIF3221380" },
  { code: "TIF3221379" },
  { code: "TIF3221378" },
  { code: "TIF3221377" },
  { code: "TIF3221376" },
  { code: "TIF3221375" },
  { code: "TIF3221374" },
  { code: "TIF3221373" },
  { code: "TIF3221372" }
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("materials", (data) => {
    if (!data.materials) {
      chrome.storage.local.set({ materials: theMaterialCodes });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveMaterial") {
    chrome.storage.local.get("materials", (data) => {
      let materials = data.materials || theMaterialCodes;
      let existing = materials.find(m => m.code === request.material.code);
      if (existing) {
        existing.content = request.material.content;
      } else {
        materials.push(request.material);
      }
      chrome.storage.local.set({ materials }, () => sendResponse());
    });
    return true;
  }

  if (request.action === "getMaterials") {
    chrome.storage.local.get("materials", (data) => {
      sendResponse(data.materials || theMaterialCodes);
    });
    return true;
  }

  if (request.action === "deleteMaterial") {
    chrome.storage.local.get("materials", (data) => {
      let materials = data.materials || theMaterialCodes;
      materials = materials.filter(m => m.code !== request.code);
      chrome.storage.local.set({ materials }, () => sendResponse());
    });
    return true;
  }
});
