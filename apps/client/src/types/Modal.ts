export type ModalBaseProps = {
  isOpen: boolean
  onClose: () => void
  afterLeave?: () => void
  loading?: boolean
}
