import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import Organisation from 'App/Models/Organisation'
import User from 'App/Models/User'
import { mailFrom } from 'Config/mail'
import { generateInvitiationUrl } from 'Helpers/links'
import { getTenantHostname } from 'Helpers/subdomain'
import mjml from 'mjml'

export default class OrganisationInvitation extends BaseMailer {
  constructor(
    private readonly organisation: Organisation,
    private readonly user: User,
    private readonly verificationCode: string
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
  private template = 'emails/organisation_invitation'

  /**
   * The prepare method is invoked automatically when you run
   * "OnboardAccount.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    const invitationUrl = generateInvitiationUrl(
      getTenantHostname(this.organisation.subdomain),
      this.user.email,
      this.verificationCode
    )

    const renderedView = await View.render(this.template, {
      organisation: this.organisation,
      user: this.user,
      inviteUrl: invitationUrl,
    })

    const htmlResult = mjml(renderedView).html

    message.subject('Join Organisation').from(mailFrom).to(this.user.email).html(htmlResult)
  }
}
