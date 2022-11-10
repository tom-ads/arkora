import { test } from '@japa/runner'

test.group('Auth: Registration - Verify Details', () => {
  test('valid details for registration step', async ({ client }) => {
    const response = await client.post('/auth/register/details').form({
      firstname: 'bob',
      lastname: 'marley',
      email: 'bob.marley@example.com',
      password: 'newPassword123!',
      password_confirmation: 'newPassword123!',
    })

    response.assertStatus(204)
  })

  test('invalid details for registration step', async ({ client }) => {
    const response = await client.post('/auth/register/details').form({
      firstname: undefined,
      lastname: undefined,
      email: undefined,
      password: undefined,
      password_confirmation: undefined,
    })

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
