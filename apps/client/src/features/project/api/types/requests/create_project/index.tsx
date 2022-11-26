type CreateProjectRequest = {
  name: string
  clientId: number
  showCost: boolean
  private: boolean
  team: Array<number>
}

export default CreateProjectRequest
