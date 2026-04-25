<template>
  <div class="w-full max-w-[400px] mx-auto bg-black text-white min-h-screen font-sans flex flex-col relative pb-24 shadow-2xl">
    <div
      class="flex justify-between items-center px-6 pt-3 text-[13px] font-medium"
    >
      <span>9:41</span>
      <div class="flex space-x-1.5 items-center">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 22h20V2L2 22z" />
        </svg>
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          />
        </svg>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 4h-3V2h-4v2H7v18h10V4z" />
        </svg>
      </div>
    </div>

    <div
      class="flex justify-between items-center mt-6 px-4 text-gray-500 text-xs"
    >
      <div
        v-for="day in weekDays"
        :key="day.date"
        class="flex flex-col items-center"
      >
        <span class="mb-2">{{ day.week }}</span>
        <div
          :class="[
            'w-9 h-11 flex items-center justify-center rounded-xl border',
            day.active
              ? 'bg-[#1a1a1c] border-gray-500 text-white font-bold'
              : 'border-transparent text-gray-400',
          ]"
        >
          {{ day.date }}
        </div>
      </div>
    </div>

    <div
      class="mx-4 mt-6 rounded-[1.5rem] p-5 bg-[linear-gradient(135deg,#fac6aa_0%,#f59abf_50%,#88bcf0_100%)] text-white shadow-lg relative overflow-hidden"
    >
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-1.5 text-sm font-medium opacity-90">
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          12 Dec
        </div>
        <button
          @click="toggleChat"
          class="bg-white/30 hover:bg-white/40 transition backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-full"
        >
          进入对话
        </button>
      </div>
      <div class="text-[13px] opacity-90 mb-1">Today's AI Analysis</div>
      <div class="text-2xl font-bold leading-tight">
        You Have 5 <br />
        Tasks
        <span
          class="inline-flex items-center bg-white/25 text-xs px-2 py-0.5 rounded-full mx-1 align-middle"
          >urgent
          <svg
            class="w-3 h-3 ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            /></svg
        ></span>
        for Today.
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 px-4 mt-4">
      <div class="bg-[#bce08a] rounded-[1.5rem] p-5 flex flex-col">
        <h3 class="text-black font-bold text-sm mb-4">Priority Task</h3>
        <div class="flex flex-col gap-3 flex-1">
          <div
            v-for="task in priorityTasks"
            :key="task.id"
            class="flex items-center gap-2 cursor-pointer group"
            @click="toggleTask(task)"
          >
            <div
              class="w-[18px] h-[18px] rounded-full border-[1.5px] border-black flex items-center justify-center transition-colors"
              :class="
                task.completed
                  ? 'bg-black'
                  : 'bg-transparent group-hover:bg-black/10'
              "
            >
              <svg
                v-if="task.completed"
                class="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span class="text-black text-xs flex-1 truncate">{{
              task.title
            }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div
          class="bg-[#242426] rounded-[1.5rem] p-4 flex flex-col justify-center"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="relative w-12 h-12 flex-shrink-0">
              <svg
                class="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  class="text-[#3a3a3c]"
                  stroke-width="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="text-[#f52b7a]"
                  stroke-width="4"
                  stroke-dasharray="30, 100"
                  stroke-linecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div
                class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
              >
                30%
              </div>
            </div>
            <div class="text-[11px] leading-snug text-gray-300">
              <span class="font-bold text-white text-xs">Today</span><br />
              Completed<br />
              <span class="text-gray-500">22/72 task</span>
            </div>
          </div>

          <div>
            <div class="text-[11px] font-bold mb-1">Goal</div>
            <div class="w-full h-3.5 bg-[#3a3a3c] rounded-full overflow-hidden">
              <div class="w-[30%] h-full bg-[#8e8e93] rounded-full"></div>
            </div>
          </div>
        </div>

        <div
          class="bg-[#242426] rounded-[1.5rem] p-4 flex items-center gap-3 flex-1"
        >
          <div
            class="w-8 h-8 rounded-full bg-[#1c1c1e] flex items-center justify-center border border-gray-700"
          >
            <svg
              class="w-4 h-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div class="text-xs">
            <div class="font-bold">延期任务</div>
            <div class="text-gray-500 mt-0.5">6 task</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-[#1c1c1e] rounded-t-[1.5rem] mt-4 flex-1 p-5 border-t border-gray-800"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Task Tree</h2>
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      <div class="text-[13px] font-mono tracking-wide text-gray-300">
        <TaskTreeNode :data="taskTreeData" :is-root="true" />
      </div>
    </div>

    <div
      class="absolute bottom-0 w-full bg-black/90 backdrop-blur-md px-8 py-5 border-t border-gray-900 flex justify-between items-center rounded-t-3xl z-50"
    >
      <div
        class="w-10 h-10 bg-[#df8b5b] rounded-xl flex items-center justify-center text-black"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>
      <svg
        class="w-6 h-6 text-gray-500 hover:text-white transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <svg
        class="w-6 h-6 text-gray-500 hover:text-white transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <svg
        class="w-6 h-6 text-gray-500 hover:text-white transition"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  </div>
  <Transition name="fade">
    <div
      v-if="isChatOpen"
      class="fixed inset-0 z-[100] bg-black flex flex-col max-w-[400px] mx-auto border-x border-gray-800"
      style="height: 100vh; height: 100dvh; overflow: hidden;"
    >
      <div
        class="p-6 flex justify-between items-center border-b border-gray-800"
      >
        <h2 class="text-xl font-bold text-white">AI 任务规划助手</h2>
        <button
          @click="toggleChat"
          class="p-2 hover:bg-gray-800 rounded-full transition"
        >
          <svg
            class="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="flex-1 p-6 overflow-y-auto flex flex-col justify-end gap-2">
        <!-- 历史消息 -->
        <div
          v-for="(msg, idx) in chatHistory"
          :key="idx"
          :class="
            msg.isUser ? 'self-end bg-blue-600' : 'self-start bg-gray-800'
          "
          class="px-4 py-2 rounded-xl max-w-[80%] text-white"
        >
          {{ msg.text }}
          <button
            v-if="!msg.isUser && msg.canSync && !msg.synced"
            @click="syncGoalToHome(msg)"
            :disabled="isAiLoading || msg.syncing"
            class="mt-2 block w-full bg-green-600 hover:bg-green-700 py-1 rounded text-xs font-bold transition disabled:opacity-50"
          >
            {{ msg.syncing ? "同步中..." : "确认同步到主页" }}
          </button>
        </div>

        <!-- 加载中 -->
        <div v-if="isAiLoading" class="self-center">
          <div class="animate-spin h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-800 bg-black">
        <div class="flex gap-3 bg-gray-900 p-2 rounded-2xl items-center">
          <input
            v-model="userInput"
            @keyup.enter="askAI"
            placeholder="输入你的目标..."
            class="flex-1 bg-transparent border-none focus:ring-0 text-white px-3 py-2"
          />
          <button
            @click="askAI"
            :disabled="isAiLoading"
            class="bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, defineComponent, h, onMounted  } from "vue"; // 加上 onMounted
import { api } from "../api.js"; // 核心：引入你写的 api 对象

// ... 下面是原本的代码

// --- 1. 日历数据模拟 ---
const weekDays = ref([
  { week: "日", date: "12", active: false },
  { week: "一", date: "13", active: false },
  { week: "二", date: "14", active: true },
  { week: "三", date: "15", active: false },
  { week: "四", date: "16", active: false },
  { week: "五", date: "17", active: false },
  { week: "六", date: "18", active: false },
]);

// --- 2. 优先级任务数据 (双向绑定测试) ---
const priorityTasks = ref([]);

const toggleTask = (task) => {
  task.completed = !task.completed;
};

// --- 3. 树状图静态数据 ---
const taskTreeData = ref([]);

// 控制对话弹窗显示
const isChatOpen = ref(false);
// 用户输入的内容
const userInput = ref("");
const chatHistory = ref([]); // 对话历史
// 加载状态
const isAiLoading = ref(false);
// 记录最近一次用户的“目标”（用于同步/重试）
const lastGoal = ref("");

// 打开/关闭对话框
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
  if (!isChatOpen.value) userInput.value = ""; // 关闭时清空输入
};

// （最小闭环）拆解入库并刷新主页
const syncGoalToHome = async (msg) => {
  const cleanGoal = (msg?.goal || "").trim();
  if (!cleanGoal) return;

  // 前端防连点
  msg.syncing = true;
  isAiLoading.value = true;

  try {
    const res = await api.decomposeTask(cleanGoal);

    // 同步成功：标记已同步，避免再次显示按钮
    msg.synced = true;
    msg.canSync = false;

    // 这里不要再 push “规划完成”导致重复卡片（可选）
    // 如果你想提示成功，可以追加一条短提示，但不再带同步按钮：
    chatHistory.value.push({
      text: res.data?.reply || "已同步到主页。",
      isUser: false,
      canSync: false,
    });

    // 只拉“最新 plan”的数据刷新主页
    await loadLatestDataFromBackend();

    // 关闭对话框，回到主页
    isChatOpen.value = false;
    userInput.value = "";
  } catch (error) {
    console.error("同步失败:", error);
    chatHistory.value.push({
      text: "同步失败：请检查后端 /api/tasks/ai-decompose 和数据库连接。",
      isUser: false,
      canSync: false,
    });
  } finally {
    msg.syncing = false;
    isAiLoading.value = false;
  }
};

// 调用 AI 拆解接口
const askAI = async () => {
  if (!userInput.value.trim()) return;

  const userText = userInput.value.trim();
  lastGoal.value = userText;

  // 1) 先展示用户消息
  chatHistory.value.push({ text: userText, isUser: true });
  userInput.value = "";

  // 2) 调 chat 接口生成规划文本（不入库）
  isAiLoading.value = true;
  try {
    const res = await api.chat(userText);
    const replyText = res.data?.reply || "我已生成规划方案，你可以确认同步到主页。";

    // 这条 AI 消息“可同步”
    chatHistory.value.push({
      text: replyText,
      isUser: false,
      canSync: true,
      synced: false,
      syncing: false,
      goal: userText, // 绑定本次 goal，避免用 lastGoal 导致错同步
    });
  } catch (e) {
    console.error("对话失败:", e);
    chatHistory.value.push({
      text: "对话失败：请检查后端 /api/chat 是否正常。",
      isUser: false,
      canSync: false,
    });
  } finally {
    isAiLoading.value = false;
  }
};

// --- 4. 核心：单文件内的递归组件 (Functional Component 方案) ---
// 为了不拆分文件，直接在 script setup 中声明递归渲染器，精准还原了目录树的虚线/实线结构
const TaskTreeNode = defineComponent({
  name: "TaskTreeNode",
  props: {
    data: { type: Array, required: true },
    isRoot: { type: Boolean, default: false },
  },
  setup(props) {
    return () => {
      return h(
        "ul",
        { class: props.isRoot ? "" : "ml-[11px]" },
        props.data.map((node, index) => {
          const isLastNode = index === props.data.length - 1;

          return h("li", { class: "relative text-gray-200" }, [
            // 非根节点时，渲染向下的垂直连接线（如果不是最后一项，连到底部；如果是，只连到中间高度）
            !props.isRoot
              ? h("div", {
                  class: `absolute left-0 top-0 border-l-[1.5px] border-gray-600 ${isLastNode ? "h-4" : "h-full"}`,
                })
              : null,

            // 文本节点包装器
            h("div", { class: "flex items-center h-8" }, [
              // 非根节点时，渲染向右的水平连接线
              !props.isRoot
                ? h("div", { class: "w-4 border-t-[1.5px] border-gray-600" })
                : null,
              h(
                "span",
                { class: props.isRoot ? "font-bold text-white" : "ml-2" },
                node.label,
              ),
            ]),

            // 递归调用子节点
            node.children && node.children.length > 0
              ? h(TaskTreeNode, { data: node.children, isRoot: false })
              : null,
          ]);
        }),
      );
    };
  },
});

const priorityRank = (p) => {
  if (p === "高") return 3;
  if (p === "中") return 2;
  if (p === "低") return 1;
  return 0;
};

const buildTaskTree = (rows) => {
  const byId = new Map();
  const roots = [];

  for (const t of rows) {
    byId.set(t.id, { label: t.title, children: [], raw: t });
  }
  for (const t of rows) {
    const node = byId.get(t.id);
    if (!node) continue;
    if (t.parent_id && byId.has(t.parent_id)) {
      byId.get(t.parent_id).children.push(node);
    } else if (t.task_type === "main" || t.parent_id == null) {
      roots.push(node);
    }
  }
  return roots;
};

// 定义一个函数去后端拿数据
const loadLatestDataFromBackend = async () => {
  try {
    const response = await api.getTasks();
    const realDataArray = response.data.data || [];

    if (Array.isArray(realDataArray)) {
      const normalized = realDataArray.map((t) => ({
        ...t,
        completed: t.status === "done" || t.status === "completed",
      }));

      const sorted = [...normalized].sort((a, b) => {
        if (a.task_type !== b.task_type) return a.task_type === "main" ? -1 : 1;
        const pr = priorityRank(b.priority) - priorityRank(a.priority);
        if (pr !== 0) return pr;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      priorityTasks.value = sorted.slice(0, 5);
      taskTreeData.value = buildTaskTree(normalized);
    }
  } catch (error) {
    console.error("加载最新任务失败:", error);
  }
};

// 3. 页面一挂载就执行加载
/*onMounted(() => {
  loadDataFromBackend();
});*/
</script>

<style scoped>
/* 隐藏移动端可能出现的滚动条，保持App级别的视觉整洁 */
::-webkit-scrollbar {
  display: none;
}
</style>
