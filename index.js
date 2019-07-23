'use strict';

const apiKey = 'a2abe20515614ec78c50f36ed75ae4ee';

const weatherKey = '33e3423da0904e1da3f4de0f590e53e7';

const searchNewsURL = 'https://newsapi.org/v2/everything';

const weatherURL = `https://api.darksky.net/forecast/`
const getLatLngURL = 'https://get.geojs.io/v1/ip/geo.json';


const weatherData = {
    lat: "", 
    lng: "",
    city: "",
    state: "",
    country: "",
    temp: "",
    pressure:"",
    humidity: ""
}
    // let lat
    // let lng 
    // let city
    // let state
    // let country

    // let temp
    // let pressure
    // let humidity
    // let temp_min
    // let temp_max
    // let weather_description

// const getAirQualityURL = `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`;

// const weatherURL = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lng}`;



// `https://api.darksky.net/forecast/${weatherKey}/${lat},${lng}`


function getLatLong() {
    console.log('getLatLong ran')
    console.log(getLatLngURL);
    fetch(getLatLngURL)
        .then(response => {
            return response.json();
        })
        .then(responseJson => {
            displayLatLng(responseJson)
            getLocalWeather()
        });
}

function displayLatLng(responseJson) {

    weatherData.lat = responseJson.latitude;
    weatherData.lng = responseJson.longitude;
    weatherData.city = responseJson.city;
    weatherData.state = responseJson.region;
    weatherData.country = responseJson.country;

    console.log(weatherData.lat, weatherData.lng, weatherData.city, weatherData.state, weatherData.country);

    $('#city-state').html(
        `<ul>
        <li>city:${weatherData.city}</li>
        <li>state:${weatherData.state}</li>
        <li>latitude:${weatherData.lat}</li>
        <li>longitude:${weatherData.lng}</li>
    </ul>`)
}

function getLocalWeather(){


    // const params = {
    //     key: weatherKey,
    // }
    console.log('local weather ran');
    console.log('latitude', weatherData.lat);
    console.log('longitude', weatherData.lng);
    console.log(weatherURL);

    // const queryString = formatWeatherQueryParams(params)
    const url = 'https://cors-anywhere.herokuapp.com/' + weatherURL + weatherKey + '/' + weatherData.lat + ',' + weatherData.lng;

    fetch(url)
    .then(response =>{
       return response.json();
    })

    .then(responseJson => displayWeather(responseJson))

}

function displayWeather(){

    //add html to display

}

function formatWeatherQueryParams(params){
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}







// function getAirQuality(){
//     console.log('getAirQuality ran');
//     fetch(getAirQualityURL)
//         .then(response => {
//             return response.json();
//         })
        
   
// }

function displayAirQuality(responseJson) {
    console.log(responseJson);
    $('#air-quality').html(`<ul><li>air quality index:${city}</li></ul>`)
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
    // if there are previous results, remove them
    console.log(responseJson);
    $('.results-list').empty();
    // iterate through the articles array, stopping at the max number of results
    for (let i = 0; i < responseJson.articles.length & i < maxResults; i++) {
        // for each video object in the articles
        //array, add a list item to the results 
        //list with the article title, source, author,
        //description, and image
        $('.results-list').append(
            `<li><h3><a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a></h3>
      <p>${responseJson.articles[i].source.name}</p>
      <p>By ${responseJson.articles[i].author}</p>
      <p>Published on ${responseJson.articles[i].publishedAt}
      <p>${responseJson.articles[i].description}</p>
      <img src='${responseJson.articles[i].urlToImage}'>
      </li>`
        )
    };
    //display the results section  
    $('#results').removeClass('hidden');
};

function getNews(query, maxResults = 10) {
    const params = {
        q: query,
        language: "en",
    };
    const queryString = formatQueryParams(params)
    const url = searchNewsURL + '?' + queryString;

    console.log(url);

    const options = {
        headers: new Headers({
            "X-Api-Key": apiKey
        })
    };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
            $('.js-error-message').text(`Something went wrong: ${err.message}`);
        });
}





function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getNews(searchTerm, maxResults);
        
    });

    
}

$(watchForm);

function navBar() {

    $('.nav-li').click(event => {
        $(event.currentTarget).find('.conservation').val();

    })


    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $(event.currentTarget).find('#js-search-conservation').val()

        const maxResults = $('#js-max-results-conserv').val();
        getNews(searchTerm, maxResults);
    });

}





$(navBar);


//function to run when the page loads
getLatLong();
