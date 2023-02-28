function generateInvitiationUrl(origin: string, email: string, token: string) {
  return `${origin}/invitation?email=${email}&token=${token}`
}

export { generateInvitiationUrl }
