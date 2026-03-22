from pydantic import BaseModel
from typing import Optional

class DividendIndexBase(BaseModel):
    index_id: str
    name: str

class DividendIndex(DividendIndexBase):
    close: Optional[float] = None
    dividend_yield: Optional[float] = None
    pe: Optional[float] = None
    pb: Optional[float] = None
    change_pct: Optional[float] = None

    class Config:
        from_attributes = True

class DividendIndexListResponse(BaseModel):
    total: int
    items: list[DividendIndex]