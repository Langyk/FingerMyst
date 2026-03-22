from pydantic import BaseModel
from typing import Optional
from datetime import date

class BondBase(BaseModel):
    bond_id: str
    name: str

class Bond(BondBase):
    yield_rate: Optional[float] = None
    maturity: Optional[date] = None
    rating: Optional[str] = None
    price: Optional[float] = None
    change_pct: Optional[float] = None

    class Config:
        from_attributes = True

class BondListResponse(BaseModel):
    total: int
    items: list[Bond]