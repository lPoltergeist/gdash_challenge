import { Body, Controller, Get, Post } from '@nestjs/common';
import { WeatherService } from './user.service';
import { WeatherData } from '../../schema/weatherData.schema';

@Controller()
export class WeatherController {
  constructor(private readonly appService: WeatherService) { }

  @Get('users')
  getUser(): string {
    return this.appService.getStatus();
  }

  @Post('users')
  postWeatherData(@Body() data: WeatherData) {
    this.appService.insertWeather(data);
  }
}
