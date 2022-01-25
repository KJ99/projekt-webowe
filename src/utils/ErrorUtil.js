export const errorsMap = {
    'auth/wrong-password': 'Cannot log in. Username or password is invalid',
    'auth/email-already-in-use': 'Provided email is already taken',
    'auth/weak-password': 'Password should be at least 6 characters long'
}

export const getErrorMessage = (code) => errorsMap[code] ?? 'Unexpected error has occured'