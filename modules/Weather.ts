import axios from "axios";
import { IWeatherData } from "../types/IWeatherData";

export class Weather {
    public async getWeather(locationName: string) {
        const weatherResponseData = (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${process.env.WeatherApiKey}&units=metric`)).data
        try {
            if (weatherResponseData.coord.lon && weatherResponseData.coord.lat) {
                const oneCallResponseData = (await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lon=${weatherResponseData.coord.lon}&lat=${weatherResponseData.coord.lat}&appid=${process.env.WeatherApiKey}&exclude=minutely,hourly&units=metric`)).data
                const dailyForecastData: any[] = [];
                oneCallResponseData.daily.forEach((day: { dt: number, weather: { icon: string, main: string; }[]; temp: { max: number; min: number; }; }) => {
                    dailyForecastData.push({
                        date: new Date((day.dt + oneCallResponseData.timezone_offset) * 1000).toDateString(),
                        imageUrl: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
                        description: day.weather[0].main,
                        high: day.temp.max.toFixed(),
                        low: day.temp.min.toFixed()
                    })
                });
                // Create weather data for card
                const weatherData: IWeatherData = {
                    location: `${weatherResponseData.name}, ${weatherResponseData.sys.country}`,
                    currentTemp: oneCallResponseData.current.temp.toFixed(),
                    currentDescription: oneCallResponseData.current.weather[0].main,
                    sunrise: new Date((oneCallResponseData.current.sunrise + oneCallResponseData.timezone_offset) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date((oneCallResponseData.current.sunset + oneCallResponseData.timezone_offset) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    currentHumidity: oneCallResponseData.current.humidity,
                    currentWindSpeed: oneCallResponseData.current.wind_speed.toFixed(),
                    currentImageUrl: `http://openweathermap.org/img/wn/${oneCallResponseData.current.weather[0].icon}@2x.png`,
                    dailyForecastData
                }
                return weatherData
            }
        } catch (error) {
            if (error.response.status !== 404) {
                throw new Error("Sorry, an error occurred.");
            }
        }
    }

}


