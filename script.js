let currencyChart; // Глобальная переменная для графика

// Инициализация графика при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateChart('RUB', 'USD'); // Дефолтные валюты при старте
});

// Функция создания графика
function initChart() {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    currencyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Даты (заполнятся позже)
            datasets: [
                {
                    label: 'Курс',
                    data: [],
                    borderColor: '#007bff',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Функция обновления графика
async function updateChart(fromCurrency, toCurrency) {
    try {
        // Получаем данные за 7 дней (имитация - в реальности нужен API с историей)
        const rates = await fetchHistoricalData(fromCurrency, toCurrency);

        // Обновляем график
        currencyChart.data.labels = rates.dates;
        currencyChart.data.datasets[0].label = `${fromCurrency} → ${toCurrency}`;
        currencyChart.data.datasets[0].data = rates.values;
        currencyChart.update();
    } catch (error) {
        console.error('Ошибка загрузки данных для графика:', error);
    }
}

// Имитация API с историческими данными (в реальности нужно использовать API типа https://exchangerate.host/#/)
async function fetchHistoricalData(fromCurrency, toCurrency) {
    // В реальном проекте здесь должен быть fetch к API с историей курсов
    // Для демо генерируем случайные данные
    const days = 7;
    const dates = [];
    const values = [];

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());

        // Генерация "правдоподобного" случайного курса
        const baseRate = fromCurrency === 'USD' && toCurrency === 'RUB' ? 80 : 1;
        values.push((baseRate * (0.95 + Math.random() * 0.1)).toFixed(4));
    }

    return { dates, values };
}

// Остальной код (конвертер и swap) остаётся без изменений
document.getElementById('swap-btn').addEventListener('click', () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const tempValue = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempValue;

    // Обновляем график при смене валют
    updateChart(fromCurrency.value, toCurrency.value);
});

document.getElementById('convert-btn').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const resultElement = document.getElementById('result');

    if (!amount) {
        resultElement.textContent = 'Введите сумму';
        return;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();

        if (!data.rates[toCurrency]) {
            throw new Error('Валюта не найдена');
        }

        const rate = data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;

        // Обновляем график после конвертации
        updateChart(fromCurrency, toCurrency);
    } catch (error) {
        resultElement.textContent = 'Ошибка: ' + error.message;
    }
});