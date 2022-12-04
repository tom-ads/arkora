import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { nodeEnv } from 'Config/app'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  public async run() {
    await Promise.all([
      this.runSeeder(await import('../Role')),
      this.runSeeder(await import('../Currency')),
      this.runSeeder(await import('../WorkDay')),
      this.runSeeder(await import('../BudgetType')),
      this.runSeeder(await import('../Task')),
    ])

    if (nodeEnv === 'development') {
      await this.runSeeder(await import('../DevelopmentSeeder'))
    }
  }
}
