export function validateUserForm(formData) {
    const errors = {}

    if (!formData.name?.trim()) errors.name = 'O nome é obrigatório'

    if (!formData.email?.trim()) errors.email = 'O email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errors.email = 'O email não é válido.'

    if (!formData.phoneNumber && formData.phoneNumber !== 0)
        errors.phoneNumber = 'O número de telefone é obrigatório.'
    else if (!/^\+?\d{9,15}$/.test(String(formData.phoneNumber)))
        errors.phoneNumber = 'Número de telefone inválido.'

    if (!formData.birthdate) errors.birthdate = 'A data de nascimento é obrigatória.'

    if (!formData.countryID)
        errors.countryID = 'O país é obrigatório.'

    if (!formData.usertypeID)
        errors.usertypeID = 'A divisão é obrigatória.'

    return errors
}

export function getEmptyUser() {
    return {
        name: '',
        birthdate: '',
        email: '',
        phoneNumber: '',
        pfp: '',
        countryID: '',
        usertypeID: '',
        notification_status: false,
    }
}