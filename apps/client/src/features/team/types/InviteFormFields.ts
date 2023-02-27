import { SelectedMember } from './SelectedMember'

export type InviteFormFields = {
  email: string | null
  selectedFile: File | null
  containsHeaders: boolean
  selectedHeader: string | null
  members: SelectedMember[]
}
