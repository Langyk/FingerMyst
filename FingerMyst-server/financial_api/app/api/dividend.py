from fastapi import APIRouter, HTTPException, Query
from app.services.dividend_service import DividendIndexService
from app.schemas.dividend import DividendIndex, DividendIndexListResponse

router = APIRouter()

@router.get("/", response_model=DividendIndexListResponse)
def get_all_dividend_indices():
    """获取所有红利指数列表"""
    indices = DividendIndexService.get_all_dividend_indices()
    return DividendIndexListResponse(total=len(indices), items=indices)

@router.get("/{index_id}", response_model=DividendIndex)
def get_dividend_index(index_id: str):
    """根据指数代码获取红利指数详情"""
    index = DividendIndexService.get_dividend_index_by_id(index_id)
    if not index:
        raise HTTPException(status_code=404, detail="红利指数不存在")
    return index

@router.get("/search/", response_model=DividendIndexListResponse)
def search_dividend_indices(keyword: str):
    """搜索红利指数"""
    indices = DividendIndexService.search_dividend_indices(keyword)
    return DividendIndexListResponse(total=len(indices), items=indices)

@router.get("/high-yield/", response_model=DividendIndexListResponse)
def get_high_yield_indices(min_yield: float = Query(default=4.0, ge=0, le=20)):
    """获取高股息率指数"""
    indices = DividendIndexService.get_high_dividend_indices(min_yield)
    return DividendIndexListResponse(total=len(indices), items=indices)