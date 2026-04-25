import axios from "axios";

const service = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000,
});

export const api = {
  // 你原来的接口
  getTasks() {
    return service.get("/tasks");
  },
  decomposeTask(goal) {
    return service.post("/tasks/ai-decompose", { goal });
  },

  // 👈 在这里加一个新的对话接口 👇
  chat(message) {
    // 对应后端的 /api/chat
    return service.post("/chat", { message });
  },
};
