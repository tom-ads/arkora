import Task from '@/types/Task'

type GetTasksResponse = Task[] | Record<string, Task[]>

export default GetTasksResponse
