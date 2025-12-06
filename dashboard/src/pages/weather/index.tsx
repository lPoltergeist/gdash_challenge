import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import getWeatherIcon from '@/components/weatherDashboard/dinamicWeatherIcon'
import GetFilesModal from '@/components/weatherDashboard/getFilesModal'
import WeatherCard from '@/components/weatherDashboard/weatherCard'
import formatSunTime from '@/helper/formatSunTime'
import returnDateNow from '@/helper/returnDateNow'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'

const WeatherDashboard = () => {
    const [weather, setWeather] = useState<any>(null)
    const [weatherInsight, setWeatherInsight] = useState<any>()
    const [dateNow, setDateNow] = useState<string>()
    const [openModal, setOpenModal] = useState<boolean>(false)

    let lastIndex = 0
    if (weather) lastIndex = weather.length - 1;

    const handleSelect = (format: any) => {
        setOpenModal(false)

        api.get(`/${format}`, {
            responseType: "blob",
        }).then((response) => {
            const blob = new Blob([response.data], {
                type: format === "xlsx"
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    : "text/csv",
            })

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `dados.${format}`
            a.click()
            window.URL.revokeObjectURL(url)
        }).catch((err) => {
            console.log("erro ao baixar arquivo:", err)
        })
    }

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const responseWeather = await api.get('/weather')
                const responseInsight = await api.get('/weather/insight')

                setWeather(responseWeather.data)
                setWeatherInsight(responseInsight.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchWeather()
        setDateNow(returnDateNow())

        const oneHour = 60 * 60 * 1000
        const interval = setInterval(() => {
            fetchWeather()
            setDateNow(returnDateNow())
        }, oneHour)

        return () => clearInterval(interval)
    }, [])

    return (
        <main className="min-h-screen to-violet-900 text-slate-100 p-6">
            <div className="max-w-5xl mx-auto">

                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#F5D10D]">
                            {weather?.[lastIndex]?.weather[0].main ?
                                getWeatherIcon(weather[lastIndex].weather[0].main) : "clear"}
                            Weather Dashboard</h1>
                        <p className="mt-1 text-slate-300">Clima atual + Insight gerado por IA</p>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article className="glass rounded-2xl p-6 shadow-xl flex flex-col gap-4 bg-white/5 backdrop-blur-lg border border-white/10">
                        <div className="flex items-center justify-between px-7">
                            <div >
                                <h2 className="text-xl font-bold">Clima Atual</h2>
                                <p className="text-sm text-slate-300">{weather?.[lastIndex]?.name ?? '--'}</p>
                            </div>
                            <div className="flex items-center gap-4">

                                <div className="text-right">
                                    <div className="text-4xl font-extrabold">{weather?.[lastIndex]?.main?.temp ?? '--'}°</div>
                                    <div className="text-sm text-slate-300">— {weather?.[lastIndex]?.weather?.[0].description ?? '--'} —</div>
                                </div>
                            </div>
                        </div>


                        <CardContent className="grid grid-cols-2 gap-3 mt-2">
                            <WeatherCard label="humidade" data={`${weather?.[lastIndex]?.main?.humidity ?? '--'} %`} />
                            <WeatherCard label="Vento" data={`${weather?.[lastIndex].wind.speed ?? '--'} m/s`} />
                            <WeatherCard
                                label="Nascer do Sol"
                                data={weather?.[lastIndex]?.sys?.sunrise
                                    ? formatSunTime(weather[lastIndex].sys.sunrise)
                                    : "--:--"}
                            />

                            <WeatherCard
                                label="Por do Sol"
                                data={weather?.[lastIndex]?.sys?.sunset
                                    ? formatSunTime(weather[lastIndex].sys.sunset)
                                    : "--:--"}
                            />

                        </CardContent>
                    </article>

                    <Card className="glass rounded-2xl p-6 shadow-xl flex flex-col bg-white/5 backdrop-blur-lg border border-white/10">

                        <CardHeader className="text-center">
                            <CardTitle className="text-xl font-bold">Insight</CardTitle>
                        </CardHeader>

                        <CardContent className="flex justify-center">
                            {weatherInsight ? (
                                <p className="text-sm text-slate-300">
                                    {weatherInsight}
                                </p>) : (
                                <p>Carregando insight...</p>
                            )}
                        </CardContent>


                        <div className="mt-auto pt-4 text-sm text-slate-300 text-center opacity-80">
                            <span>Última atualização: {dateNow}</span>
                        </div>
                    </Card>
                </section>
            </div>

            <Button
                onClick={() => setOpenModal(true)}
                className="h-10 w-35 rounded-md fixed bottom-4 right-4 !bg-[#F5D10D] !hover:bg-[#e5c009] !text-black"
            >
                Baixar Dados
            </Button>

            <GetFilesModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSelect={handleSelect}
            />

        </main>
    )
}

export default WeatherDashboard
