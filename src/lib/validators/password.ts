const validatePassword = (password: string) => {
  const trimmedPassword = password.trim()
  const capitalLetterError = /[A-Z]+/.test(trimmedPassword) ? null : 'хотя бы 1 заглавную букву;'
  const lowercaseLetterError = /[a-z]+/.test(trimmedPassword) ? null : 'хотя бы 1 строчную букву;'
  const numericError = /[0-9]+/.test(trimmedPassword) ? null : 'хотя бы 1 цифру;'
  const lengthError = trimmedPassword.length >= 8 ? null : 'минимум 8 символов'

  return [capitalLetterError, lowercaseLetterError, numericError, lengthError]
}

export const isPasswordValid = (password: string) => !validatePassword(password).some(Boolean)
export const getPasswordErrors = (password: string) =>
  validatePassword(password).filter(Boolean) as string[]
