import Status from '@/enums/Status'

type Project = {
  name: string
  showCost: boolean
  private: boolean
  status: Status
}

export default Project
