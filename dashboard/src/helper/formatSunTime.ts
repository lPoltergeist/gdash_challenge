const formatSunTime = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000)
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })
}

export default formatSunTime