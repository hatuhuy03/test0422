chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        fetch('http://192.168.1.21:5000/check_url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: tab.url })
        })
        .then(response => response.json())
        .then(data => {
            chrome.storage.local.set({ phishing_result: data });
        })
        .catch(error => console.error("Error fetching data:", error));
    }
});
