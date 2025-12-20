export function validateUserForm(formData) {
    const errors = {}

    //TODO | FAZER CONFIRMAÇÕES

    return errors
}

export function getEmptyUser() {
    return {
        name: '',
        birthdate: '',
        email: '',
        phoneNumber: '',
        pfp: '',
        nationality: '',
        usertypeID: '',
    }
}