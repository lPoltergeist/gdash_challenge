const returnDateNow = (): string => {
    return new Date().toLocaleDateString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_paulo"
    })
}

export default returnDateNow