import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherData } from './schema/weatherData.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }

  @Post('weather')
  postWeatherData(@Body() data: WeatherData) {
    this.appService.insertWeather(data);
    console.log('Weather data inserted');
  }
}
