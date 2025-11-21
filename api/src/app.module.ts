import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/weatherdb'),

    MongooseModule.forFeature([{ name: 'WeatherData', schema: require('./schema/weatherData.schema').WeatherDataSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
