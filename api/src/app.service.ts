import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'Service is running';
  }

  postWeatherData(data: any) {
    console.log('Weather data received:', data);

  }
}
