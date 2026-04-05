// ========== ГЕНЕРАЦИЯ ТЯЖЁЛОЙ СЕТКИ (200+ элементов) ==========
const megaGrid = document.getElementById('megaGrid');
const GRID_ITEMS_COUNT = 280; // 280 блоков для нагрузки

for (let i = 0; i < GRID_ITEMS_COUNT; i++) {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.textContent = `#${i + 1}`;
    item.setAttribute('data-id', i);
    megaGrid.appendChild(item);
}

console.log(`✅ Создано ${GRID_ITEMS_COUNT} элементов сетки`);

// ========== ТАБЛИЦА: 1500 СТРОК (тяжёлый рендер) ==========
const tableBody = document.getElementById('tableBody');
const ROWS_COUNT = 1500;

function generateHash() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 8);
}

for (let i = 0; i < ROWS_COUNT; i++) {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const dataCell = document.createElement('td');
    const hashCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const weightCell = document.createElement('td');
    
    idCell.textContent = i + 1;
    dataCell.textContent = `data_${Math.random().toString(36).substring(2, 10)}_${Math.floor(Math.random() * 10000)}`;
    hashCell.textContent = generateHash().substring(0, 12);
    const statuses = ['🟢 Актив', '🟡 Ожид', '🔴 Нагр', '⚫ Тест'];
    statusCell.textContent = statuses[Math.floor(Math.random() * statuses.length)];
    weightCell.textContent = `${Math.floor(Math.random() * 999) + 1} KB`;
    
    row.appendChild(idCell);
    row.appendChild(dataCell);
    row.appendChild(hashCell);
    row.appendChild(statusCell);
    row.appendChild(weightCell);
    tableBody.appendChild(row);
}

console.log(`✅ Создано ${ROWS_COUNT} строк в таблице`);

// ========== 500 КРУГЛЫХ БЛОКОВ ==========
const circlesContainer = document.getElementById('circlesContainer');
const CIRCLES_COUNT = 500;

for (let i = 0; i < CIRCLES_COUNT; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.textContent = i + 1;
    circlesContainer.appendChild(circle);
}

console.log(`✅ Создано ${CIRCLES_COUNT} кругов`);

// ========== ДОПОЛНИТЕЛЬНАЯ НАГРУЗКА: 5000 маленьких элементов в скрытом блоке ==========
const hiddenLoad = document.createElement('div');
hiddenLoad.style.display = 'none';
hiddenLoad.id = 'hiddenLoadTest';

for (let i = 0; i < 5000; i++) {
    const span = document.createElement('span');
    span.textContent = 'x';
    span.style.opacity = '0.01';
    span.setAttribute('data-load', i);
    hiddenLoad.appendChild(span);
}
document.body.appendChild(hiddenLoad);
console.log(`✅ Добавлено 5000 скрытых элементов (нагрузка на DOM)`);

// ========== ТЯЖЁЛЫЕ ВЫЧИСЛЕНИЯ В ФОНЕ (циклы, массивы) ==========
const heavyArray = [];
for (let i = 0; i < 200000; i++) {
    heavyArray.push({ 
        index: i, 
        value: Math.random() * 10000,
        nested: { a: i * 2, b: i * 3, c: Math.sin(i) }
    });
}
console.log(`✅ Создан массив из ${heavyArray.length.toLocaleString()} объектов (доп. нагрузка на память)`);

// ========== ИМИТАЦИЯ ДОЛГИХ ОПЕРАЦИЙ (setTimeout не блокирует, но грузит ЦП) ==========
setTimeout(() => {
    let sum = 0;
    for (let i = 0; i < 5000000; i++) {
        sum += Math.sqrt(i);
    }
    console.log(`🧮 Фоновое вычисление завершено (сумма корней: ${sum.toFixed(2)})`);
}, 100);

// ========== ДОБАВЛЯЕМ ДИНАМИЧЕСКИЕ СТИЛИ ДЛЯ НАГРУЗКИ ==========
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    /* Динамически добавленные тяжёлые стили */
    .grid-item:nth-child(3n+1) { background: linear-gradient(45deg, #ff0844, #ffb199); }
    .grid-item:nth-child(3n+2) { background: linear-gradient(45deg, #00b09b, #96c93d); }
    .grid-item:nth-child(3n+3) { background: linear-gradient(45deg, #757f9a, #d7dde8); }
    .circle:nth-child(odd) { animation: pulse 0.8s infinite alternate; }
    @keyframes pulse { from { opacity: 0.7; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }
    .heavy-table td:nth-child(3) { font-family: monospace; letter-spacing: 1px; }
`;
document.head.appendChild(styleSheet);

// ========== ЛОГИРОВАНИЕ ДЛЯ ИНФОРМАЦИИ ==========
console.log('%c🔥 ТЯЖЁЛАЯ СТРАНИЦА ЗАГРУЖЕНА 🔥', 'color: red; font-size: 20px; font-weight: bold;');
console.log(`📊 Статистика:
- Элементов в сетке: ${GRID_ITEMS_COUNT}
- Строк в таблице: ${ROWS_COUNT}
- Кругов: ${CIRCLES_COUNT}
- Скрытых элементов: 5000
- Объектов в массиве: ${heavyArray.length.toLocaleString()}
- Общее кол-во DOM-узлов (приблизительно): ~${(GRID_ITEMS_COUNT + ROWS_COUNT * 5 + CIRCLES_COUNT + 5000 + 500).toLocaleString()}
`);

// ========== ДОПОЛНИТЕЛЬНО: МНОГО СЛУШАТЕЛЕЙ ДЛЯ НАГРУЗКИ ==========
document.querySelectorAll('.grid-item').forEach(el => {
    el.addEventListener('click', () => {
        // Пустой обработчик, но создаёт нагрузку на память
        console.log('клик по сетке');
    });
});

document.querySelectorAll('.circle').forEach(el => {
    el.addEventListener('mouseenter', () => {
        // просто для нагрузки
    });
});