import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherDataDocument = WeatherData & Document;

@Schema({ _id: false })
class Coord {
    @Prop() lon: number;
    @Prop() lat: number;
}

@Schema({ _id: false })
class WeatherInfo {
    @Prop() id: number;
    @Prop() main: string;
    @Prop() description: string;
    @Prop() icon: string;
}

@Schema({ _id: false })
class MainData {
    @Prop() temp: number;
    @Prop() feels_like: number;
    @Prop() temp_min: number;
    @Prop() temp_max: number;
    @Prop() pressure: number;
    @Prop() humidity: number;
    @Prop() sea_level: number;
    @Prop() grnd_level: number;
}

@Schema({ _id: false })
class Wind {
    @Prop() speed: number;
    @Prop() deg: number;
}

@Schema({ _id: false })
class Clouds {
    @Prop() all: number;
}

@Schema({ _id: false })
class Sys {
    @Prop() type: number;
    @Prop() id: number;
    @Prop() country: string;
    @Prop() sunrise: number;
    @Prop() sunset: number;
}

// --------------------------------------------------
// Root Schema
// --------------------------------------------------

@Schema({ timestamps: true })
export class WeatherData {
    @Prop({ type: Coord }) coord: Coord;

    @Prop({ type: [WeatherInfo] })
    weather: WeatherInfo[];

    @Prop() base: string;

    @Prop({ type: MainData }) main: MainData;

    @Prop() visibility: number;

    @Prop({ type: Wind }) wind: Wind;

    @Prop({ type: Clouds }) clouds: Clouds;

    @Prop() dt: number;

    @Prop({ type: Sys }) sys: Sys;

    @Prop() timezone: number;
    @Prop() id: number;
    @Prop() name: string;
    @Prop() cod: number;
}

export const WeatherDataSchema = SchemaFactory.createForClass(WeatherData);
