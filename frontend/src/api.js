import axios from "axios";

// 1. 基础配置：把后端地址存进去
const service = axios.create({
  baseURL: "http://localhost:3000/api", // 以后后端地址改了，只改这一处即可
  timeout: 10000, // 如果 AI 响应太慢，超过 10 秒才会报错
});

// 2. 导出具体的接口函数，方便在 Home.vue 里“到处调用”
export const api = {
  // 获取任务列表（把浏览器里那堆 JSON 拿回来）
  getTasks() {
    return service.get("/tasks");
  },

  // 呼叫豆包 AI 拆解任务（把输入框的目标发给后端）
  decomposeTask(goal) {
    return service.post("/tasks/ai-decompose", { goal });
  },

  // (预留) 更新任务状态，比如勾选完成
  updateTaskStatus(id, status) {
    return service.post(`/tasks/update`, { id, status });
  },
};
