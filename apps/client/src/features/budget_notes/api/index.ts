import Client from '@/types/models/Client'
import appApi from 'api'
import { BudgetNote } from '@/types/models/BugetNote'

const budgetNoteBasePath = '/api/v1/budgets'

const budgetNoteEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    getBudgetNotes: build.query<BudgetNote, number>({
      query: (id) => `${budgetNoteBasePath}/${id}`,
      providesTags: ['Client'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetBudgetNotesQuery } = budgetNoteEndpoints
