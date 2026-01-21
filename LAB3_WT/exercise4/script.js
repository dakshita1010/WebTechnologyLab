(function() {
    const style = document.createElement('style');
    style.textContent = `
        #monitor-ui {
            position: fixed; top: 10px; right: 10px; width: 350px; height: 500px;
            background: #fff; border: 2px solid #333; z-index: 9999;
            display: flex; flex-direction: column; font-family: sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); border-radius: 8px;
        }
        #monitor-header {
            padding: 10px; background: #333; color: #fff; font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
        }
        #activity-log {
            flex-grow: 1; overflow-y: auto; padding: 10px;
            font-size: 12px; background: #f9f9f9;
        }
        .log-entry { margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #ddd; }
        .warning { color: white; background: #ff4444; padding: 10px; font-weight: bold; text-align: center; }
        .controls { padding: 10px; display: flex; gap: 5px; background: #eee; }
        button { flex: 1; cursor: pointer; padding: 5px; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.id = 'monitor-ui';
    ui.innerHTML = `
        <div id="monitor-header">Activity Monitor <span id="click-count">Clicks: 0</span></div>
        <div id="warning-box"></div>
        <div id="activity-log"></div>
        <div class="controls">
            <button id="reset-btn">Reset</button>
            <button id="export-btn">Export</button>
        </div>
    `;
    document.body.appendChild(ui);

    const logContainer = document.getElementById('activity-log');
    const warningBox = document.getElementById('warning-box');
    const clickCountDisplay = document.getElementById('click-count');
    
    let logs = [];
    let clickCount = 0;
    const CLICK_THRESHOLD = 10;

    function addLog(type, target, phase) {
        const entry = {
            timestamp: new Date().toLocaleTimeString(),
            type: type,
            target: target,
            phase: phase
        };
        logs.push(entry);

        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `[${entry.timestamp}] <b>${type}</b> on <i>${target}</i> (${phase})`;
        logContainer.prepend(div);

        if (type === 'click' && phase === 'Capturing') {
            clickCount++;
            clickCountDisplay.textContent = `Clicks: ${clickCount}`;
            if (clickCount > CLICK_THRESHOLD) {
                warningBox.innerHTML = `<div class="warning">⚠️ SUSPICIOUS ACTIVITY: EXCESSIVE CLICKS</div>`;
            }
        }
    }

    const events = ['click', 'keydown', 'focus'];
    
    events.forEach(eventType => {
        window.addEventListener(eventType, (e) => {
            const targetName = e.target.tagName || 'Window';
            addLog(eventType, targetName, 'Capturing');
        }, true);

        window.addEventListener(eventType, (e) => {
            const targetName = e.target.tagName || 'Window';
            addLog(eventType, targetName, 'Bubbling');
        }, false);
    });

    document.getElementById('reset-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        logs = [];
        clickCount = 0;
        logContainer.innerHTML = '';
        warningBox.innerHTML = '';
        clickCountDisplay.textContent = 'Clicks: 0';
    });

    document.getElementById('export-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const text = logs.map(l => `${l.timestamp} | ${l.type} | Target: ${l.target} | Phase: ${l.phase}`).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activity_log.txt';
        a.click();
    });
})();