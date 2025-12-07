import { BadGatewayException, Injectable } from '@nestjs/common';
import { WeatherData, WeatherDataDocument } from '../../schema/weatherData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { Parser } from '@json2csv/plainjs/index.js';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(WeatherData.name) private weatherModel: Model<WeatherDataDocument>) { }

  async insertWeather(data: WeatherData): Promise<WeatherData> {
    const createdData = new this.weatherModel(data);
    return createdData.save();
  }

  returnAllWeather(): Promise<WeatherData[]> {
    const weatherData = this.weatherModel.find().exec();

    if (weatherData == null || weatherData === undefined) throw new Error('No weather data found');


    return weatherData;
  }

  async genAIWeatherInsight(): Promise<string | undefined> {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_APIKEY!,
    })
    const data = await this.weatherModel.findOne().sort({ _id: -1 }).exec();

    if (!data) throw new Error('No weather data available for insight generation');


    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Gere um insight sobre os seguintes dados meteorológicos em português do Brasil, que seja curto, informativo e humorístico:
      Temperatura: ${data.main.temp}°C
      Humidade: ${data.main.humidity}%
      Vento: ${data.wind.speed} m/s
      Tempo: ${data.weather[0].description}%
      Cidade: ${data.name}
      
      obs: Não comece o insight com "O insight é" ou algo parecido.`,
    })

    if (response.text === undefined) return "No insight generated"

    return response.text;
  }

  async returnWeatherCSV(): Promise<string> {
    const weatherData = await this.weatherModel.find().sort({ _id: -1 }).lean().exec()

    if (!weatherData) throw new BadGatewayException

    const parser = new Parser()
    const weatherCSV = parser.parse(weatherData)

    return weatherCSV
  }

  async returnWeatherXLSX(): Promise<ArrayBuffer> {
    const weatherData = await this.weatherModel.find().sort({ _id: -1 }).lean().exec()

    if (!weatherData) throw new BadGatewayException

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Weather');

    worksheet.columns = Object.keys(weatherData[0]).map((key) => ({
      header: key,
      key
    }))

    weatherData.forEach((item) => {
      worksheet.addRow(item)
    })

    const weatherXLSX = await workbook.xlsx.writeBuffer();

    return weatherXLSX
  }

}
