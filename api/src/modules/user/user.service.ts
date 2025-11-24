import { Injectable } from '@nestjs/common';
import { WeatherData, WeatherDataDocument } from '../../schema/weatherData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class Service {
  constructor(@InjectModel(WeatherData.name) private weatherModel: Model<WeatherDataDocument>) { }

  getStatus(): string {
    return 'Service is running';
  }

  async insertWeather(data: WeatherData): Promise<WeatherData> {
    const createdData = new this.weatherModel(data);
    return createdData.save();
  }

  returnAllWeather(): Promise<WeatherData[]> {
    const weatherData = this.weatherModel.find().exec();
    console.log('Fetching all weather data', weatherData);

    if (weatherData == null || weatherData === undefined) {
      throw new Error('No weather data found');
    }

    return weatherData;
  }

  async genAIWeatherInsight(): Promise<string | undefined> {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_APIKEY!,
    })
    const data = await this.weatherModel.findOne().sort({ _id: -1 }).exec();

    if (!data) {
      throw new Error('No weather data available for insight generation');
    }

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Gere um insight sobre os seguintes dados meteorológicos em português do Brasil, que seja curto, informativo e humorístico:
      Temperatura: ${data.main.temp}°C
      Humidade: ${data.main.humidity}%
      Vento: ${data.wind.speed} m/s
      Tempo: ${data.weather[0].description}%
      
      obs: Não comece o insight com "O insight é" ou algo parecido.`,
    })

    if (response.text === undefined) return "No insight generated"

    return response.text;
  }
}
