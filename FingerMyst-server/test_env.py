#!/usr/bin/env python3
"""测试 Python 环境是否正常工作"""


def test_python_env():
    """验证 Python 环境的基本功能"""
    # 测试 1: 基本导入
    import sys
    import os
    import json

    # 测试 2: 检查 Python 版本
    print(f"Python 版本: {sys.version}")
    assert sys.version_info >= (3, 8), "Python 版本过低"

    # 测试 3: 检查工作目录
    print(f"当前工作目录: {os.getcwd()}")

    # 测试 4: 检查虚拟环境
    venv_path = os.environ.get("VIRTUAL_ENV")
    if venv_path:
        print(f"虚拟环境: {venv_path}")
    else:
        print("未检测到虚拟环境（正常）")

    # 测试 5: 简单计算
    result = sum(range(100))
    assert result == 4950, "数学计算错误"
    print(f"简单计算测试: sum(range(100)) = {result}")

    # 测试 6: 文件操作
    test_file = "test_env.txt"
    with open(test_file, "w") as f:
        f.write("test")
    with open(test_file, "r") as f:
        content = f.read()
    os.remove(test_file)
    assert content == "test", "文件读写测试失败"
    print("文件读写测试: 通过")

    print("\n✅ Python 环境测试全部通过!")
    return True


if __name__ == "__main__":
    test_python_env()
    import akshare as ak
    import time
    import random

    # 1. 设置全局请求间隔（新版 AKShare 支持）
    var = ak.set_option  # 每次请求间隔 0.5 秒

    # 2. 批量循环必须加随机延时（关键！）
    stock_list = ["000001", "600000", "000002"]
    for code in stock_list:
        try:
            df = ak.stock_zh_a_daily(symbol=code, start_date="20260101", end_date="20260322")
            print(f"{code} 成功")
        except Exception as e:
            print(f"{code} 失败: {e}")
        # 随机 3–8 秒延时，模拟人工
        time.sleep(random.uniform(3, 8))

    # 3. 开启重试（新版支持 retry_count）
    df = ak.stock_zh_a_daily(symbol="000001", retry_count=3)