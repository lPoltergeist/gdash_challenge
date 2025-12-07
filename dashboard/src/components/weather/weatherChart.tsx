import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeatherChart = ({ data }: any) => {
    const chartData = data?.map((item: any) => ({
        time: new Date(item.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }),
        temp: item.main.temp,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        wind: item.wind.speed
    }));

    return (
        <>
            <ResponsiveContainer width="100%" height={250}>
                <h3>Temperatura</h3>
                <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#fff" />
                    <YAxis stroke="#eee" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        labelStyle={{ color: '#bbb' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#1E90FF"
                        strokeWidth={3}
                        name="Temperatura (°C)"
                        dot={{ r: 3, stroke: '#1E90FF', strokeWidth: 2, fill: '#1E90FF' }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="wind"
                        stroke="#FFD700"
                        strokeWidth={3}
                        name="Vento (m/s)"
                        dot={{ r: 3, stroke: '#FFD700', strokeWidth: 2, fill: '#FFD700' }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp_min"
                        stroke="#DC143C"
                        strokeWidth={3}
                        name="Temperatura Mínima (°C)"
                        dot={{ r: 3, stroke: '#DC143C', strokeWidth: 2, fill: '#DC143C' }}
                        activeDot={{ r: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp_max"
                        stroke="#FF7F50"
                        strokeWidth={3}
                        name="Temperatura Máxima (°C)"
                        dot={{ r: 3, stroke: '#FF7F50', strokeWidth: 2, fill: '#FF7F50' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={250} className="mt-10">
                <h3>Humidade</h3>
                <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#fff" />
                    <YAxis stroke="#eee" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                        labelStyle={{ color: '#bbb' }}
                        itemStyle={{ color: '#fff' }}
                    />

                    <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#00FA9A"
                        strokeWidth={3}
                        name="Humidade (%)"
                        dot={{ r: 3, stroke: '#00FA9A', strokeWidth: 2, fill: '#00FA9A' }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
};

export default WeatherChart;
