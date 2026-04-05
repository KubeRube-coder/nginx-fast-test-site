// ========== СПИСОК ТЯЖЁЛЫХ ФАЙЛОВ ДЛЯ ЗАГРУЗКИ (СЕТЕВАЯ НАГРУЗКА) ==========
// Видеофайлы (10-50 MB каждый) — используем публичные тестовые видео
const HEAVY_FILES = [
    // Большие видеофайлы (sample-videos.com)
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', size: 15, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', size: 18, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFunflies.mp4', size: 12, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', size: 14, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', size: 16, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', size: 22, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', size: 28, type: 'video' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCar.mp4', size: 11, type: 'video' },
    
    // Большие изображения (5-10 MB) с picsum
    { url: 'https://picsum.photos/id/1/2000/3000', size: 8, type: 'image' },
    { url: 'https://picsum.photos/id/10/2500/4000', size: 12, type: 'image' },
    { url: 'https://picsum.photos/id/15/3000/2000', size: 9, type: 'image' },
    { url: 'https://picsum.photos/id/20/3500/2500', size: 11, type: 'image' },
    { url: 'https://picsum.photos/id/25/4000/3000', size: 14, type: 'image' },
    { url: 'https://picsum.photos/id/30/2800/4200', size: 13, type: 'image' },
    { url: 'https://picsum.photos/id/35/3200/2400', size: 10, type: 'image' },
    { url: 'https://picsum.photos/id/40/3600/2400', size: 12, type: 'image' },
    { url: 'https://picsum.photos/id/45/3000/3000', size: 11, type: 'image' },
    { url: 'https://picsum.photos/id/50/4000/2500', size: 13, type: 'image' },
    
    // Большие PDF/документы (используем тестовые файлы)
    { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', size: 5, type: 'document' },
    { url: 'https://www.clickdimensions.com/links/TestPDFfile.pdf', size: 6, type: 'document' },
    
    // Аудиофайлы
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', size: 7, type: 'audio' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', size: 8, type: 'audio' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', size: 9, type: 'audio' }
];

// Дублируем файлы для ещё большей нагрузки (каждый загружается отдельным запросом)
let downloadQueue = [];
for (let i = 0; i < 3; i++) {  // 3 копии = в 3 раза больше трафика
    HEAVY_FILES.forEach(file => {
        downloadQueue.push({
            ...file,
            id: `${file.url}_${Date.now()}_${Math.random()}`,
            instance: i
        });
    });
}

// Перемешиваем очередь для равномерной нагрузки
for (let i = downloadQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [downloadQueue[i], downloadQueue[j]] = [downloadQueue[j], downloadQueue[i]];
}

// ========== СОСТОЯНИЕ ==========
let isDownloading = false;
let activeDownloads = 0;
let totalBytesLoaded = 0;
let totalRequestsCompleted = 0;
let currentDownloads = new Map(); // для отслеживания активных загрузок
let downloadTimeout = null;

const mediaZone = document.getElementById('mediaZone');
const logList = document.getElementById('logList');
const totalLoadedSpan = document.getElementById('totalLoaded');
const totalRequestsSpan = document.getElementById('totalRequests');
const activeDownloadsSpan = document.getElementById('activeDownloads');

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function formatBytes(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
}

function updateStats() {
    totalLoadedSpan.textContent = formatBytes(totalBytesLoaded);
    totalRequestsSpan.textContent = totalRequestsCompleted;
    activeDownloadsSpan.textContent = activeDownloads;
}

function addLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString();
    logEntry.textContent = `[${timestamp}] ${message}`;
    logList.appendChild(logEntry);
    logEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Ограничиваем лог 200 записями
    while (logList.children.length > 200) {
        logList.removeChild(logList.firstChild);
    }
}

function createMediaElement(file, blobUrl) {
    const wrapper = document.createElement('div');
    wrapper.className = 'media-item';
    wrapper.setAttribute('data-id', file.id);
    
    let element;
    if (file.type === 'video') {
        element = document.createElement('video');
        element.controls = true;
        element.loop = true;
        element.muted = true;
        element.style.maxHeight = '200px';
    } else if (file.type === 'image') {
        element = document.createElement('img');
    } else if (file.type === 'audio') {
        element = document.createElement('audio');
        element.controls = true;
    } else {
        element = document.createElement('iframe');
        element.style.width = '100%';
        element.style.height = '200px';
    }
    
    element.src = blobUrl;
    if (file.type === 'video') element.autoplay = false;
    
    const label = document.createElement('div');
    label.className = 'media-label';
    label.textContent = `${file.type.toUpperCase()} — ~${file.size} MB`;
    
    wrapper.appendChild(element);
    wrapper.appendChild(label);
    mediaZone.appendChild(wrapper);
    
    // Автоудаление через 30 секунд (чтобы не засорять DOM)
    setTimeout(() => {
        if (wrapper.parentNode) {
            wrapper.remove();
        }
    }, 30000);
}

async function downloadFile(file) {
    if (!isDownloading) return false;
    
    activeDownloads++;
    updateStats();
    
    const startTime = Date.now();
    addLog(`⬇️ НАЧАЛО: ${file.type} (~${file.size} MB) — ${file.url.substring(0, 60)}...`, 'info');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 сек таймаут
        
        const response = await fetch(file.url, {
            signal: controller.signal,
            cache: 'no-store' // не используем кэш, чтобы реально качать
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const contentLength = response.headers.get('content-length');
        const blob = await response.blob();
        const fileSize = blob.size;
        
        totalBytesLoaded += fileSize;
        totalRequestsCompleted++;
        activeDownloads--;
        
        const duration = (Date.now() - startTime) / 1000;
        const speed = (fileSize / 1024 / 1024 / duration).toFixed(2);
        
        addLog(`✅ ГОТОВО: ${file.type} — ${(fileSize / 1024 / 1024).toFixed(2)} MB за ${duration.toFixed(1)}с (${speed} MB/s)`, 'success');
        
        // Создаём URL для отображения в DOM
        const blobUrl = URL.createObjectURL(blob);
        createMediaElement(file, blobUrl);
        
        // Освобождаем URL через минуту
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        
        updateStats();
        return true;
        
    } catch (error) {
        activeDownloads--;
        addLog(`❌ ОШИБКА: ${file.type} — ${error.message}`, 'error');
        updateStats();
        return false;
    }
}

async function startNetworkLoad() {
    if (isDownloading) {
        addLog('⚠️ Загрузка уже идёт!', 'info');
        return;
    }
    
    isDownloading = true;
    addLog('🚀 ЗАПУСК СЕТЕВОЙ НАГРУЗКИ!', 'info');
    addLog(`📦 В очереди: ${downloadQueue.length} файлов (~${downloadQueue.reduce((sum, f) => sum + f.size, 0)} MB всего)`, 'info');
    
    // Запускаем параллельные загрузки (10-15 одновременных соединений)
    const CONCURRENT_DOWNLOADS = 12;
    let queueIndex = 0;
    
    async function worker() {
        while (isDownloading && queueIndex < downloadQueue.length) {
            const file = downloadQueue[queueIndex++];
            await downloadFile(file);
            // Небольшая задержка между запросами, чтобы не перегружать слишком жестко
            await new Promise(r => setTimeout(r, 100));
        }
    }
    
    // Запускаем воркеров
    const workers = [];
    for (let i = 0; i < CONCURRENT_DOWNLOADS; i++) {
        workers.push(worker());
    }
    
    await Promise.all(workers);
    
    if (isDownloading) {
        addLog('🏁 ВСЕ ФАЙЛЫ ЗАГРУЖЕНЫ! СЕТЬ НАГРУЖЕНА ПОЛНОСТЬЮ', 'success');
        isDownloading = false;
    }
}

function stopNetworkLoad() {
    if (!isDownloading) {
        addLog('⚠️ Загрузка не активна', 'info');
        return;
    }
    
    isDownloading = false;
    addLog('🛑 ОСТАНОВКА СЕТЕВОЙ НАГРУЗКИ (ожидание завершения текущих...)', 'warning');
    
    // Даём время завершиться текущим загрузкам
    setTimeout(() => {
        if (activeDownloads === 0) {
            addLog('✅ Все загрузки остановлены', 'success');
        } else {
            addLog(`⚠️ Остановлено принудительно, осталось ${activeDownloads} загрузок`, 'warning');
        }
    }, 2000);
}

function clearCacheAndReset() {
    addLog('🔄 Очистка кэша и перезагрузка страницы...', 'info');
    // Очищаем кэш через hard reload
    if ('caches' in window) {
        caches.keys().then(keys => {
            keys.forEach(key => caches.delete(key));
        });
    }
    setTimeout(() => {
        location.reload(true);
    }, 500);
}

// ========== АВТОМАТИЧЕСКИЙ СТАРТ ПРИ ЗАГРУЗКЕ ==========
// Чтобы страница сразу начинала грузить сеть (опционально)
setTimeout(() => {
    addLog('💡 Готово! Нажмите "СТАРТ" для нагрузки сети', 'info');
    addLog(`📊 Доступно ${downloadQueue.length} файлов для загрузки`, 'info');
    addLog('🎯 Рекомендуется: запустить и смотреть скорость в инспекторе сети (F12 → Network)', 'info');
}, 1000);

// ========== КНОПКИ ==========
document.getElementById('startLoadBtn').addEventListener('click', startNetworkLoad);
document.getElementById('stopLoadBtn').addEventListener('click', stopNetworkLoad);
document.getElementById('clearCacheBtn').addEventListener('click', clearCacheAndReset);

// Обновляем статистику каждые 0.5 секунды
setInterval(updateStats, 500);