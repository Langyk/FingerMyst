from fastapi import APIRouter, HTTPException
from app.services.bond_service import BondService
from app.schemas.bond import Bond, BondListResponse

router = APIRouter()

@router.get("/", response_model=BondListResponse)
def get_all_bonds():
    """获取所有债券列表"""
    bonds = BondService.get_all_bonds()
    return BondListResponse(total=len(bonds), items=bonds)

@router.get("/{bond_id}", response_model=Bond)
def get_bond(bond_id: str):
    """根据债券代码获取债券详情"""
    bond = BondService.get_bond_by_id(bond_id)
    if not bond:
        raise HTTPException(status_code=404, detail="债券不存在")
    return bond

@router.get("/search/", response_model=BondListResponse)
def search_bonds(keyword: str):
    """搜索债券"""
    bonds = BondService.search_bonds(keyword)
    return BondListResponse(total=len(bonds), items=bonds)