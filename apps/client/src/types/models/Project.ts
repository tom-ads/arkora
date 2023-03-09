import Status from '@/enums/Status'

type Project = {
  id: number
  name: string
  showCost: boolean
  private: boolean
  status: Status
}

export default Project
