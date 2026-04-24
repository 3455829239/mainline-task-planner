require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { OpenAI } = require("openai");

const app = express(); // 👈 就是这行被删掉了，导致了报错
const port = 3000;

// 1. 中间件配置
app.use(cors());
app.use(express.json());

// 2. 数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Bonniee123#",
  database: process.env.DB_NAME || "mainline_task_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 3. 初始化 AI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "76750870-5160-409b-8d03-ea2b098be0f8",
  baseURL: process.env.OPENAI_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
});

// --- 业务接口 ---

// 智能任务拆解接口 (已修复 reply 逻辑)
app.post("/api/tasks/ai-decompose", async (req, res) => {
  const { goal } = req.body;
  console.log(`🤖 正在拆解目标: ${goal}`);

  try {
    const completion = await openai.chat.completions.create({
      model: "ep-20260421163924-tsgrb",
      messages: [
        {
          role: "system",
          content:
            '你是一个项目管理专家。请将用户目标拆解为1个主线任务和3个具体的子任务。必须严格以 JSON 格式输出，结构为：{"main": "主任务", "subs": ["子任务1", "子任务2", "子任务3"]}',
        },
        { role: "user", content: goal },
      ],
      response_format: { type: "json_object" },
    });

    const aiData = JSON.parse(completion.choices[0].message.content);

    // 入库
    const [mainResult] = await pool.execute(
      "INSERT INTO tasks (title, task_type, priority, status) VALUES (?, ?, ?, ?)",
      [aiData.main, "main", "高", "todo"],
    );
    const parentId = mainResult.insertId;

    for (const subTitle of aiData.subs) {
      await pool.execute(
        "INSERT INTO tasks (title, task_type, parent_id, status) VALUES (?, ?, ?, ?)",
        [subTitle, "side", parentId, "todo"],
      );
    }

    // ✅ 返回给前端对话框显示的 reply
    res.json({
      success: true,
      reply: `规划完成！主任务：${aiData.main}。子任务已同步到主页。`,
      message: "数据已入库",
    });
  } catch (error) {
    console.error("❌ 失败:", error);
    res.status(500).json({ success: false, reply: "抱歉，规划出错了。" });
  }
});

// 获取任务列表接口
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 纯对话接口 (如果你的前端 chat 调用了这个)
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "ep-20260421163924-tsgrb",
      messages: [{ role: "user", content: message }],
    });
    res.json({ success: true, reply: completion.choices[0].message.content });
  } catch (error) {
    res.json({ success: false, reply: "AI暂时无法回复" });
  }
});

app.listen(port, () => {
  console.log(`🚀 后端已重启: http://localhost:${port}`);
});
