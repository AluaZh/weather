import conditions from './conditions.js';

const apiKey = 'ae319ac8b6e04f8ab22152802241805'

// Элементы на странице
const form = document.getElementById('form');
const input = document.getElementById('input');
const header = document.getElementById('header');

function removeCard(){
    const prevCard = document.getElementById('card');
        if(prevCard) {
            prevCard.remove();
        }
};

function showError(errorMessage){
    // Отобразить карточку с ошибкой 
    const html = `<div id="card">${errorMessage}</div>`
    // Отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
};

function showCard(name, country, temp, condition, icon){
    // Отображаем данные на старнице
    // Разметка для карточки
    const html = `
        <div id="card">
        <h2 id="card-city">${name}<span>${country}</span></h2>

        <div id="card-weather">
            <div id="card-value">${temp}<sup>°C</sup></div>
            <img id="card-img" src="${icon}" alt="Weather">
        </div>

        <div id="card-description">${condition}</div>
        </div>
    `

    // Отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
};

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
};
function checkTime(info){
    let date = new Date();
    let time = date.getHours();
    let conditionInfo;

    if(time > 6 && time < 18){
        conditionInfo = info.languages[23].day_text;
        return conditionInfo;
    } else{
        conditionInfo = info.languages[23].night_text;
        return conditionInfo;
    }
}

// Слушаем отправку фома 
form.onsubmit = async function(event) {
    // Отменяем отправку формы (обновление страницы)
    event.preventDefault();

    // Берём значение из input, обрезаем пробелы
    let city = input.value.trim();

    // Получаем данные с сервера
    const data = await getWeather(city);
    console.log(data)

    if(data.error) {
        // Удаляет предыдущую карту
        removeCard();
        // Выводит ошибку
        showError(data.error.message);
    } else{
        // Удаляет предыдущую карту
        removeCard();

        // Проходится по всему массиву conditions и находит код введённого города
        const info = conditions.find((obj) => obj.code === data.current.condition.code);

        // Находит ссылку на иконку 
        const icon = data.current.condition.icon;

        // Проверяет время
        let conditionInfo = await checkTime(info);

        // Отображает информацию на карте
        showCard(data.location.name, data.location.country, data.current.temp_c, conditionInfo, icon);
    };
}
