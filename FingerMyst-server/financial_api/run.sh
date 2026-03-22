#!/bin/bash
# 启动 Financial Data API

cd "$(dirname "$0")"

# 激活 conda 环境
conda activate dev_lyk

# 启动服务
echo "启动服务..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload