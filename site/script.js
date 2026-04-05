// нагрузка CPU + DOM
console.log("Speed test script loaded");

function heavyTask() {
    let arr = [];
    for (let i = 0; i < 50000; i++) {
        arr.push(Math.random() * i);
    }
    arr.sort();
    return arr;
}

// запуск при загрузке
window.onload = () => {
    console.log("Running heavy task...");
    heavyTask();
};

// немного анимации
setInterval(() => {
    document.body.style.filter =
        `hue-rotate(${Math.random() * 360}deg)`;
}, 2000);