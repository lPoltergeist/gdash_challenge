import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WeatherController } from "src/modules/weather/weather.controller";
import { WeatherService } from "src/modules/weather/weather.service";
import { WeatherDataSchema } from "./weatherData.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'WeatherData', schema: WeatherDataSchema, collection: 'weather' },
        ])
    ],
    controllers: [WeatherController],
    providers: [WeatherService],
})

export class WeatherModule { }