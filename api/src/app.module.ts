import { Module } from '@nestjs/common';
import { WeatherController } from './modules/weather/weather.controller';
import { WeatherService } from './modules/weather/weather.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/weatherdb'),

    MongooseModule.forFeature([{ name: 'WeatherData', schema: require('./schema/weatherData.schema').WeatherDataSchema }]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class AppModule { }
