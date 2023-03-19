import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { mailFrom } from 'Config/mail'
import mjml from 'mjml'

export default class ResetPassword extends BaseMailer {
  constructor(
    private readonly organisation: Organisation,
    private readonly user: User,
    private readonly resetLink: string
  ) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()
  private template = 'emails/forgot_password'

  /**
   * The prepare method is invoked automatically when you run
   * "ResetPassword.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    const renderedView = await View.render(this.template, {
      organisation: this.organisation,
      user: this.user,
      resetLink: this.resetLink,
    })

    const htmlResult = mjml(renderedView).html

    message.subject('Reset Password').from(mailFrom).to(this.user.email).html(htmlResult)
  }
}
