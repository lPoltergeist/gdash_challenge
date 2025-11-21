import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getStatus(): string {
    return this.appService.getStatus();
  }

  @Post('weather')
  postWeatherData(@Body() data: any) {
    this.appService.postWeatherData(data);
  }
}
