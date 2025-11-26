const historyDropdown = document.getElementById("history-dropdown");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");
const omniboxWrapper = document.querySelector(".omnibox-wrapper");

const MAX_HISTORY_ITEMS = 10;

function getHistory() {
    const history = localStorage.getItem("miki-history");
    return history ? JSON.parse(history) : [];
}

function getPinnedItems() {
    const pinned = localStorage.getItem("miki-pinned");
    return pinned ? JSON.parse(pinned) : [];
}

function saveToHistory(url) {
    let history = getHistory();
    history = history.filter(item => item.url !== url);
    history.unshift({ url, timestamp: Date.now(), title: url });
    history = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem("miki-history", JSON.stringify(history));
    updateHistoryDisplay();
}

function togglePin(url) {
    let pinned = getPinnedItems();
    const index = pinned.findIndex(item => item.url === url);

    if (index === -1) {
        const history = getHistory();
        const historyItem = history.find(item => item.url === url);

        if (historyItem) {
            pinned.push({ url, title: historyItem.title });
            pinned.sort((a, b) => a.title.localeCompare(b.title));
        }
    } else {
        pinned.splice(index, 1);
    }

    localStorage.setItem("miki-pinned", JSON.stringify(pinned));
    updateHistoryDisplay();
}

function updateHistoryDisplay(filterText = "") {
    const history = getHistory();
    const pinned = getPinnedItems();
    historyList.innerHTML = "";
    
    const filteredHistory = filterText 
        ? history.filter(item => 
            item.url.toLowerCase().includes(filterText.toLowerCase()) ||
            item.title.toLowerCase().includes(filterText.toLowerCase())
          )
        : history;
    
    const filteredPinned = filterText 
        ? pinned.filter(item => 
            item.url.toLowerCase().includes(filterText.toLowerCase()) ||
            item.title.toLowerCase().includes(filterText.toLowerCase())
          )
        : pinned;
    
    const allItems = [...filteredPinned, ...filteredHistory.filter(item => 
        !pinned.some(pinnedItem => pinnedItem.url === item.url)
    )];
    
    if (allItems.length === 0) {
        historyList.innerHTML = `<div class="no-history">${filterText ? "No matching results" : "No recent searches"}</div>`;
        return;
    }
    
    allItems.forEach(item => {
        const isPinned = pinned.some(pinnedItem => pinnedItem.url === item.url);

        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        
        let displayTitle = item.title;
        if (filterText) {
            const regex = new RegExp(`(${filterText})`, 'gi');
            displayTitle = displayTitle.replace(regex, '<mark>$1</mark>');
        }
        
        historyItem.innerHTML = `
            <button class="pin-btn" data-url="${item.url}">
                <i class="fas fa-thumbtack ${isPinned ? 'pinned' : ''}"></i>
            </button>
            <div class="history-icon"></div>
            <div class="history-url">${displayTitle}</div>
            <button class="delete-btn" data-url="${item.url}">
                <i class="far fa-trash-can"></i>
            </button>
        `;
        
        historyItem.addEventListener("click", (e) => {
            if (!e.target.closest('.delete-btn') && !e.target.closest('.pin-btn')) {
                address.value = item.url;

                hideHistory();
                form.dispatchEvent(new Event('submit'));
            }
        });
        
        historyItem.querySelector('.pin-btn').addEventListener("click", (e) => {
            e.stopPropagation();
            togglePin(item.url);
        });
        
        historyItem.querySelector('.delete-btn').addEventListener("click", (e) => {
            e.stopPropagation();
            deleteHistoryItem(item.url);
        });
        
        historyList.appendChild(historyItem);
    });
}

function showHistory() {
    updateHistoryDisplay();
    historyDropdown.classList.add("show");
}

function hideHistory() {
    historyDropdown.classList.remove("show");
}

function deleteHistoryItem(url) {
    let history = getHistory();
    let pinned = getPinnedItems();

    history = history.filter(item => item.url !== url);
    pinned = pinned.filter(item => item.url !== url);

    localStorage.setItem("miki-history", JSON.stringify(history));
    localStorage.setItem("miki-pinned", JSON.stringify(pinned));

    updateHistoryDisplay();
}

function clearHistory() {
    localStorage.removeItem("miki-history");
    localStorage.removeItem("miki-pinned");

    updateHistoryDisplay();
}

address.addEventListener("focus", showHistory);
address.addEventListener("input", () => {
    const value = address.value.trim();

    if (value === "") {
        showHistory();
    } else {
        updateHistoryDisplay(value);
        historyDropdown.classList.add("show");
    }
});

clearHistoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearHistory();
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".omnibox-container")) hideHistory();
});

address.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideHistory();
});
