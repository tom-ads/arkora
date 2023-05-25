import { test } from '@japa/runner'

test.group('Auth : Registration - Verify Details', () => {
  test('valid details receives a 204 response', async ({ client, route }) => {
    const response = await client
      .post(route('AuthController.verifyDetails'))
      .form({
        firstname: 'bob',
        lastname: 'marley',
        email: 'bob.marley@example.com',
        password: 'newPassword123!',
        password_confirmation: 'newPassword123!',
      })
      .withCsrfToken()

    response.assertStatus(204)
  })

  test('invalid details receives a 422 response', async ({ client, route }) => {
    const response = await client
      .post(route('AuthController.verifyDetails'))
      .form({
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        password: undefined,
        password_confirmation: undefined,
      })
      .withCsrfToken()

    response.assertStatus(422)
    response.assertBody({
      errors: [
        {
          field: 'firstname',
          message: 'Firstname is required',
          rule: 'required',
        },
        {
          field: 'lastname',
          message: 'Lastname is required',
          rule: 'required',
        },
        {
          field: 'email',
          message: 'Email is required',
          rule: 'required',
        },
        {
          field: 'password',
          message: 'Password is required',
          rule: 'required',
        },
        {
          field: 'password_confirmation',
          message: 'Confirm password is required',
          rule: 'required',
        },
      ],
    })
  })
})
