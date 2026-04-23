import axios from "axios";

const service = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 30000,
});

export const api = {
  getTasks() {
    return service.get("/tasks");
  },

  // 已修复
  decomposeTask(goal) {
    return service.post("/tasks/ai-decompose", { goal });
  },

  updateTaskStatus(id, status) {
    return service.post("/tasks/update", { id, status });
  },
};
