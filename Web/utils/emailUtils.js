// Validate email/injury form
export function validateEmailForm(formData, correctInformation) {
    const errors = {}

    if (!formData.injury_title?.trim()) errors.injury_title = 'O Título é obrigatório'

    if (!formData.injury_resume?.trim()) errors.injury_resume = 'O Resumo é obrigatório'

    if (!formData.athleteID)
        errors.athleteID = 'O Atleta é obrigatório.'

    if (formData.errorSpecID === 1)
        if (!correctInformation)
            errors.correctInformation = 'É preciso confirmar a informação.'

    return errors
}