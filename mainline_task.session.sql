-- 切换到你刚建好的新库（非常重要！）
USE mainline_task_db;

-- 创建任务表：这是 AI 以后存数据的地方
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- 自动生成 ID
    title VARCHAR(255) NOT NULL,               -- 任务标题
    task_type ENUM('main', 'side') DEFAULT 'main', -- 主线还是支线
    priority VARCHAR(50),                      -- AI 评估的优先级
    parent_id INT DEFAULT NULL,                -- 它是谁的子任务（实现任务树）
    status VARCHAR(50) DEFAULT 'todo',         -- 任务状态
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);

-- 插入一条假数据试试看
INSERT INTO tasks (title, task_type, priority) VALUES ('测试：这是我的第一个主线任务', 'main', '高');

SELECT * FROM tasks;