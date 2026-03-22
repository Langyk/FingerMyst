from fastapi import APIRouter, HTTPException
from app.services.index_service import IndexService
from app.schemas.index import Index, IndexListResponse

router = APIRouter()

@router.get("/", response_model=IndexListResponse)
def get_all_indices():
    """获取所有指数列表"""
    indices = IndexService.get_all_indices()
    return IndexListResponse(total=len(indices), items=indices)

@router.get("/{index_id}", response_model=Index)
def get_index(index_id: str):
    """根据指数代码获取指数详情"""
    index = IndexService.get_index_by_id(index_id)
    if not index:
        raise HTTPException(status_code=404, detail="指数不存在")
    return index

@router.get("/search/", response_model=IndexListResponse)
def search_indices(keyword: str):
    """搜索指数"""
    indices = IndexService.search_indices(keyword)
    return IndexListResponse(total=len(indices), items=indices)