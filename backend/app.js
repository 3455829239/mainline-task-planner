require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { OpenAI } = require("openai");

const app = express();
const port = 3000;

// 1. 中间件配置
app.use(cors());
app.use(express.json());

// 2. 数据库连接池 (从 .env 读取配置)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Bonniee123#",
  database: process.env.DB_NAME || "mainline_task_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 3. 初始化 AI (Ark 大模型)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "76750870-5160-409b-8d03-ea2b098be0f8",
  baseURL: process.env.OPENAI_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
});

// --- 业务接口 ---

/**
 * 智能任务拆解接口
 * 逻辑：先存入 plans 表获取 ID，再将拆解的任务关联该 ID 存入 tasks 表
 */
app.post("/api/tasks/ai-decompose", async (req, res) => {
  const { goal } = req.body;
  console.log(`🤖 正在为目标生成新规划: ${goal}`);

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

    // 1. 开启数据库事务，确保 plans 和 tasks 同时成功
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 2. 插入 plans 表记录本次规划
      const [planResult] = await connection.execute(
        "INSERT INTO plans (goal) VALUES (?)",
        [goal]
      );
      const currentPlanId = planResult.insertId;

      // 3. 插入主任务 (关联 plan_id)
      const [mainResult] = await connection.execute(
        "INSERT INTO tasks (title, task_type, priority, status, plan_id) VALUES (?, ?, ?, ?, ?)",
        [aiData.main, "main", "高", "todo", currentPlanId]
      );
      const parentId = mainResult.insertId;

      // 4. 插入子任务 (关联 plan_id)
      for (const subTitle of aiData.subs) {
        await connection.execute(
          "INSERT INTO tasks (title, task_type, parent_id, status, plan_id) VALUES (?, ?, ?, ?, ?)",
          [subTitle, "side", parentId, "todo", currentPlanId]
        );
      }

      await connection.commit();
      console.log(`✅ 规划已成功入库，Plan ID: ${currentPlanId}`);

      res.json({
        success: true,
        planId: currentPlanId,
        reply: `规划完成！主任务：${aiData.main}。子任务已同步到主页。`,
      });

    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("❌ 拆解失败:", error);
    res.status(500).json({ success: false, reply: "抱歉，AI 规划过程中出现了问题。" });
  }
});

/**
 * 获取任务列表接口
 * 逻辑：主页只查询最新的一次规划内容（plan_id 最大的记录）
 */
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM tasks 
       WHERE plan_id = (SELECT MAX(id) FROM plans) 
       ORDER BY FIELD(task_type, 'main', 'side'), created_at ASC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ 获取任务失败:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * 基础对话接口
 */
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "ep-20260421163924-tsgrb",
      messages: [{ role: "user", content: message }],
    });
    res.json({ success: true, reply: completion.choices[0].message.content });
  } catch (error) {
    res.json({ success: false, reply: "AI 暂时无法回复" });
  }
});

app.listen(port, () => {
  console.log(`🚀 后端服务器已启动: http://localhost:${port}`);
});