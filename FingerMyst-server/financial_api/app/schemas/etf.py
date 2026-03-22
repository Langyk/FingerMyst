from typing import List, Optional
from pydantic import BaseModel


class ETF(BaseModel):
    """ETF 数据模型"""
    代码: str
    名称: str
    最新价: Optional[float] = None
    涨跌额: Optional[float] = None
    涨跌幅: Optional[float] = None
    买入价: Optional[float] = None
    卖出价: Optional[float] = None
    昨收: Optional[float] = None
    今开: Optional[float] = None
    最高: Optional[float] = None
    最低: Optional[float] = None
    成交量: Optional[int] = None
    成交额: Optional[float] = None


class ETFListResponse(BaseModel):
    """ETF 列表响应"""
    total: int
    items: List[ETF]
