const API_URL = "https://api.datpmt.com/api/v2/dictionary/translate";

async function translate(text) {
  try {
    const url = API_URL + "?string=" + encodeURIComponent(text) + "&from_lang=en&to_lang=he";
    const response = await fetch(url);
    let result = await response.text();

    // strip wrapping quotes if present
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.substring(1, result.length - 1);
    }

    return result;
  } catch (e) {
    return text;
  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === "TRANSLATE") {
    translate(msg.text).then(function(translated) {
      sendResponse({ translated: translated });
    }).catch(function() {
      sendResponse({ translated: msg.text });
    });
    return true;
  }
});
