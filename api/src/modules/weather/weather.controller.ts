import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherData } from '../../schema/weatherData.schema';
import express from 'express';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Get('status')
  getStatus() {
    return { status: 'ok', message: 'Service is running' };
  }

  @Post('api/weather')
  @ApiExcludeEndpoint()
  postWeatherData(@Body() data: WeatherData) {
    this.weatherService.insertWeather(data);
  }

  @Get('api/weather')
  getAllWeatherData(): Promise<WeatherData[]> {
    return this.weatherService.returnAllWeather();
  }

  @Get('api/weather/insight')
  generateWeatherInsight(): Promise<string | undefined> {
    return this.weatherService.genAIWeatherInsight();
  }

  @Get('api/csv')
  async getCSV(@Res() res: express.Response) {
    const csv = await this.weatherService.returnWeatherCSV()

    res.header('Content-Type', 'text/csv')
    res.attachment('weather.csv');
    return res.send(csv)
  }

  @Get('api/xlsx')
  async getXLSX(@Res() res: express.Response) {
    const xlsx = await this.weatherService.returnWeatherXLSX()

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=weather.xlsx');

    return res.send(xlsx);
  }
}
