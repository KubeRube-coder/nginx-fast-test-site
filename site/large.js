// large.js
console.log("System script initialized...");

window.addEventListener('DOMContentLoaded', () => {
    const log = document.getElementById('content');
    const jsStatus = document.getElementById('js-status');

    function addLog(message) {
        const entry = document.createElement('div');
        entry.textContent = `> ${new Date().toLocaleTimeString()}: ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    // Имитация процесса
    addLog("Initializing load test...");
    
    setTimeout(() => {
        jsStatus.innerText = "Processing";
        jsStatus.style.color = "#fbbf24";
        addLog("Memory allocation started...");
    }, 500);

    window.onload = () => {
        jsStatus.innerText = "Stable";
        jsStatus.style.color = "#4ade80";
        addLog("All assets loaded successfully.");
    };
});
