from pydantic import BaseModel
from typing import Optional

class IndexBase(BaseModel):
    index_id: str
    name: str

class Index(IndexBase):
    close: Optional[float] = None
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    change_pct: Optional[float] = None
    volume: Optional[float] = None

    class Config:
        from_attributes = True

class IndexListResponse(BaseModel):
    total: int
    items: list[Index]