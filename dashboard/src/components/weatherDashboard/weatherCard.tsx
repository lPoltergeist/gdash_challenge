import React, { type ReactNode } from 'react'
import { Card, CardContent } from '../ui/card'

type weatherCardProps = {
    label: string,
    data: string | number
}

const WeatherCard = ({ label, data }: weatherCardProps): ReactNode => {
    return (
        <Card className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-slate-300">{label}</div>
            <div className="font-semibold text-slate-300">{data}</div>
        </Card>
    )
}

export default WeatherCard