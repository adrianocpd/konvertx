const convertButton = document.querySelector('.convert-button')
const currencySelect = document.querySelector('.currency-select')
const input = document.querySelector('.input-currency')
const currencyValueToConvert = document.querySelector('.currency-value-to-convert')
const currencyValueConverted = document.querySelector('.currency-value')
const currencyName = document.getElementById('currency-name')
const currencyImage = document.querySelector('.currency-img')

// ========== SELETORES DO TICKER ==========
const tickerDolar = document.getElementById('ticker-dolar')
const tickerEuro = document.getElementById('ticker-euro')
const tickerLibra = document.getElementById('ticker-libra')
const tickerBitcoin = document.getElementById('ticker-bitcoin')
const tickerDolarVar = document.getElementById('ticker-dolar-var')
const tickerEuroVar = document.getElementById('ticker-euro-var')
const tickerLibraVar = document.getElementById('ticker-libra-var')
const tickerBitcoinVar = document.getElementById('ticker-bitcoin-var')
const tickerHorario = document.getElementById('ticker-horario')

// Objeto com informações das moedas (taxas serão atualizadas pela API)
const currencies = {
    dolar: {
        name: 'Dólar Americano',
        image: './assets/dollar.png',
        rate: null,
        locale: 'en-US',
        code: 'USD',
        apiKey: 'USDBRL'
    },
    euro: {
        name: 'Euro',
        image: './assets/euro.png',
        rate: null,
        locale: 'de-DE',
        code: 'EUR',
        apiKey: 'EURBRL'
    },
    bitcoin: {
        name: 'Bitcoin',
        image: './assets/bitcoin 1.png',
        rate: null,
        symbol: '₿',
        apiKey: 'BTCBRL'
    },
    libra: {
        name: 'Libra Esterlina',
        image: './assets/libra.png',
        rate: null,
        locale: 'en-GB',
        code: 'GBP',
        apiKey: 'GBPBRL'
    }
}

// 🔄 Função para buscar cotações em tempo real
async function fetchExchangeRates() {
    try {
        const response = await fetch(
            'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL'
        )
        
        const data = await response.json()
        
        currencies.dolar.rate = parseFloat(data.USDBRL.bid)
        currencies.euro.rate = parseFloat(data.EURBRL.bid)
        currencies.libra.rate = parseFloat(data.GBPBRL.bid)
        currencies.bitcoin.rate = parseFloat(data.BTCBRL.bid)
        
        console.log('✅ Cotações atualizadas:', {
            dolar: currencies.dolar.rate,
            euro: currencies.euro.rate,
            libra: currencies.libra.rate,
            bitcoin: currencies.bitcoin.rate
        })
        
        return true
        
    } catch (error) {
        console.error('❌ Erro ao buscar cotações:', error)
        
        currencies.dolar.rate = 5.20
        currencies.euro.rate = 5.70
        currencies.libra.rate = 6.50
        currencies.bitcoin.rate = 350000
        
        return false
    }
}

// 📊 Função para atualizar a faixa de cotações
async function updateTicker() {
    try {
        const response = await fetch(
            'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL'
        )
        
        const data = await response.json()
        
        tickerDolar.textContent = `R$ ${parseFloat(data.USDBRL.bid).toFixed(2)}`
        tickerEuro.textContent = `R$ ${parseFloat(data.EURBRL.bid).toFixed(2)}`
        tickerLibra.textContent = `R$ ${parseFloat(data.GBPBRL.bid).toFixed(2)}`
        tickerBitcoin.textContent = `$ ${parseFloat(data.BTCBRL.bid).toLocaleString('pt-BR')}`
        
        updateVariacao(tickerDolarVar, data.USDBRL.pctChange)
        updateVariacao(tickerEuroVar, data.EURBRL.pctChange)
        updateVariacao(tickerLibraVar, data.GBPBRL.pctChange)
        updateVariacao(tickerBitcoinVar, data.BTCBRL.pctChange)
        
        const agora = new Date()
        tickerHorario.textContent = agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
        
        console.log('✅ Ticker atualizado!')
        
    } catch (error) {
        console.error('❌ Erro ao atualizar ticker:', error)
    }
}

// 🎨 Função para atualizar variação (positiva/negativa)
function updateVariacao(elemento, valor) {
    const variacao = parseFloat(valor)
    
    elemento.classList.remove('positiva', 'negativa')
    
    if (variacao >= 0) {
        elemento.textContent = `+${variacao.toFixed(2)}%`
        elemento.classList.add('positiva')
    } else {
        elemento.textContent = `${variacao.toFixed(2)}%`
        elemento.classList.add('negativa')
    }
}

// 💰 Função de conversão
function convertValues() {
    const value = Number(input.value)
    const currency = currencies[currencySelect.value]

    if (!value || value <= 0) return

    currencyValueToConvert.innerHTML = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)

    const converted = value / currency.rate

    if (currencySelect.value === 'bitcoin') {
        currencyValueConverted.innerHTML = `₿ ${converted.toFixed(8)}`
    } else {
        currencyValueConverted.innerHTML = new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code
        }).format(converted)
    }
}

// 🔄 Função para trocar moeda selecionada
function changeCurrency() {
    const currency = currencies[currencySelect.value]

    currencyName.innerHTML = currency.name
    currencyImage.src = currency.image

    convertValues()
}

// 🚀 Inicialização do app
async function init() {
    await fetchExchangeRates()
    await updateTicker()
    changeCurrency()
    
    setInterval(fetchExchangeRates, 300000)
    setInterval(updateTicker, 300000)
}

// Event Listeners
currencySelect.addEventListener('change', changeCurrency)
convertButton.addEventListener('click', convertValues)

// Inicia o app
init()