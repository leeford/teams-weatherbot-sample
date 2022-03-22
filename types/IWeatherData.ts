export interface IWeatherData {
    location: string;
    currentTemp: any;
    currentDescription: any;
    sunrise: string;
    sunset: string;
    currentHumidity: any;
    currentWindSpeed: any;
    currentImageUrl: string;
    dailyForecastData: any[];
}