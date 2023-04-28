import appApi from 'api'
import { BudgetNote } from '@/types/models/BugetNote'
import {
  CreateBudgetNoteRequest,
  DeleteBudgetNoteRequest,
  UpdateBudgetNoteRequest,
} from './types/requests'
import GetBudgetNoteRequest from './types/requests/get_note'

const budgetNoteBasePath = '/api/v1/budgets'

const budgetNoteEndpoints = appApi.injectEndpoints({
  endpoints: (build) => ({
    createBudgetNote: build.mutation<BudgetNote, CreateBudgetNoteRequest>({
      query: ({ budgetId, ...body }) => ({
        url: `${budgetNoteBasePath}/${budgetId}/notes`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BudgetNotes', 'BudgetNote'],
    }),

    getBudgetNotes: build.query<BudgetNote[], number>({
      query: (id) => `${budgetNoteBasePath}/${id}/notes`,
      providesTags: ['BudgetNotes'],
    }),

    getBudgetNote: build.query<BudgetNote, GetBudgetNoteRequest>({
      query: ({ budgetId, noteId }) => `${budgetNoteBasePath}/${budgetId}/notes/${noteId}`,
      providesTags: ['BudgetNote'],
    }),

    updateBudgetNote: build.mutation<BudgetNote[], UpdateBudgetNoteRequest>({
      query: ({ budgetId, noteId, ...body }) => ({
        url: `${budgetNoteBasePath}/${budgetId}/notes/${noteId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['BudgetNotes', 'BudgetNote'],
    }),

    deleteBudgetNote: build.mutation<void, DeleteBudgetNoteRequest>({
      query: ({ budgetId, noteId }) => ({
        url: `${budgetNoteBasePath}/${budgetId}/notes/${noteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BudgetNotes'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetBudgetNoteQuery,
  useGetBudgetNotesQuery,
  useCreateBudgetNoteMutation,
  useUpdateBudgetNoteMutation,
  useDeleteBudgetNoteMutation,
} = budgetNoteEndpoints
