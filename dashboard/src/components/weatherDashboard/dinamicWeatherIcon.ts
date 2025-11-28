const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
        case 'clear':
            return '☀️'
        case 'clouds':
            return '☁️'
        case 'rain':
            return '🌧️'
        case 'drizzle':
            return '🌦️'
        case 'thunderstorm':
            return '⛈️'
        case 'snow':
            return '❄️'
        case 'mist':
        case 'fog':
            return '🌫️'
        default:
            return '🌈'
    }
}

export default getWeatherIcon