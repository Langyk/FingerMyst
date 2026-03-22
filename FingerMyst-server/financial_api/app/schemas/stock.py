"""Pydantic schemas for securities information."""
from typing import Optional
from pydantic import BaseModel


class StockBasic(BaseModel):
    """证券基本信息模型."""
    code: str
    code_name: str
    ipoDate: Optional[str] = None
    outDate: Optional[str] = None
    type: str
    status: str

    class Config:
        from_attributes = True


class StockSearchParams(BaseModel):
    """证券搜索参数模型."""
    name: Optional[str] = None
    code: Optional[str] = None
    sec_type: Optional[str] = None
    status: Optional[str] = None


class StockListResponse(BaseModel):
    """证券列表响应模型."""
    total: int
    data: list[StockBasic]


class StockTypeInfo(BaseModel):
    """证券类型信息."""
    code: str
    name: str


class StockStatusInfo(BaseModel):
    """证券状态信息."""
    code: str
    name: str


class CacheStatusResponse(BaseModel):
    """缓存状态响应模型."""
    cached: bool
    count: int
    last_updated: Optional[str] = None
    message: str
