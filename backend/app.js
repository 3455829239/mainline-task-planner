const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { OpenAI } = require("openai"); // ✅ 新增：引入 OpenAI SDK
require("dotenv").config();

const app = express();
const port = 3000;

// 1. 中间件配置
app.use(cors());
app.use(express.json());

// 2. 创建 MySQL 数据库连接池
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bonniee123#",
  database: "mainline_task_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 3. 初始化豆包 AI (火山引擎)
// ✅ 这里建议放在数据库连接之后，业务接口之前
const openai = new OpenAI({
  apiKey: "76750870-5160-409b-8d03-ea2b098be0f8", // 👈 填入你找到的那个 Key
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
});

// 测试数据库连接状态
pool
  .getConnection()
  .then(() => console.log("✅ 数据库连接成功：已锁定 mainline_task_db"))
  .catch((err) => console.error("❌ 数据库连接失败:", err.message));

// --- 核心业务接口开始 ---

/**
 * 接口 A: 智能任务拆解 (新增)
 * 作用：调用豆包 AI 将目标拆解并存入数据库
 */
app.post("/api/tasks/ai-decompose", async (req, res) => {
  const { goal } = req.body;

  console.log(`🤖 正在请求豆包 AI 拆解目标: ${goal}`);

  try {
    const completion = await openai.chat.completions.create({
      model: "ep-20260421163924-tsgrb", // 👈 填入你创建的推理接入点 ID
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

    // 自动化入库逻辑
    // 1. 插入主任务
    const [mainResult] = await pool.execute(
      "INSERT INTO tasks (title, task_type, priority, status) VALUES (?, ?, ?, ?)",
      [aiData.main, "main", "高", "todo"],
    );
    const parentId = mainResult.insertId;

    // 2. 循环插入子任务，并关联 parent_id
    for (const subTitle of aiData.subs) {
      await pool.execute(
        "INSERT INTO tasks (title, task_type, parent_id, status) VALUES (?, ?, ?, ?)",
        [subTitle, "side", parentId, "todo"],
      );
    }

    res.json({ success: true, message: "豆包已帮你规划完成！数据已入库。" });
  } catch (error) {
    console.error("❌ 豆包调用或入库失败:", error);
    res.status(500).json({ success: false, message: "AI 暂时走神了" });
  }
});

/**
 * 接口 B: 原有的 AI 评估接口 (保留)
 */
app.post("/api/tasks/analyze", async (req, res) => {
  const { taskName, description, urgency } = req.body;
  // ... (保留你原来的模拟逻辑)
  try {
    const sql =
      "INSERT INTO tasks (title, task_type, priority, status) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [
      taskName,
      urgency > 7 ? "side" : "main",
      "中",
      "todo",
    ]);
    res.json({ success: true, data: { taskName } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

/**
 * 接口 C: 获取任务列表 (从数据库真实查询)
 */
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "查询数据库失败" });
  }
});

// --- 核心业务接口结束 ---

// 5. 启动服务器
app.listen(port, () => {
  console.log("----------------------------------------");
  console.log("🚀 任务保卫者后端已启动！");
  console.log(`📡 监听地址: http://localhost:${port}`);
  console.log("----------------------------------------");
});
