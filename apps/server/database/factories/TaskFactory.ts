import Task from 'App/Models/Task'
import Factory from '@ioc:Adonis/Lucid/Factory'
import BudgetFactory from './BudgetFactory'

export default Factory.define(Task, () => {
  return {
    name: 'Development',
  }
})
  .relation('budgets', () => BudgetFactory)
  .build()
