// app/tasks/page.jsx
import { getTasks, getAssignments } from "@/api/backend"; // Your server-side API call
import TasksClient from "@/components/TasksClient"; // Your renamed file

export default async function TasksPage() {
  const assignments = await getAssignments(); // This can run on the server
  const tasks = await getTasks(); // This can run on the server
  return <TasksClient tasks={tasks} assignments={assignments}/>;
}
