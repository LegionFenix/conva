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
        // Используем бесплатный API (не требует ключа для демо)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();

        if (!data.rates[toCurrency]) {
            throw new Error('Валюта не найдена');
        }

        const rate = data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);

        resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        resultElement.textContent = 'Ошибка: ' + error.message;
    }
});