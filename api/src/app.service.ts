import { Injectable } from '@nestjs/common';
import { WeatherData, WeatherDataDocument } from './schema/weatherData.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'Service is running';
  }

  constructor(@InjectModel(WeatherData.name) private weatherModel: Model<WeatherDataDocument>) { }

  async insertWeather(data: WeatherData): Promise<WeatherData> {
    const createdData = new this.weatherModel(data);
    return createdData.save();
  }
}
