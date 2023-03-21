type ResetPasswordRequest = {
  userId: number | string
  token: string
  password: string
  passwordConfirmation: string
}

export default ResetPasswordRequest
