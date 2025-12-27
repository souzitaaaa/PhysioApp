export function validateAuthForm(formData) {
    const errors = {}

    if (!formData.email?.trim()) errors.email = 'O email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errors.email = 'O email não é válido.'

    if (!formData.password?.trim()) errors.password = 'A Palavra-Passe é obrigatória'

    return errors
}