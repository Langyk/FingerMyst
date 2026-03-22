from fastapi import APIRouter, HTTPException, Query
from app.services.etf_service import ETFService
from typing import List, Dict, Any

router = APIRouter()


@router.get("/test", response_model=Dict[str, Any])
def test_etf_spot():
    """
    测试 fund_etf_spot_em 函数
    获取东方财富网 ETF 实时行情数据
    """
    try:
        data = ETFService.get_etf_spot_data()
        return {
            "status": "success",
            "total": len(data),
            "data": data[:5] if len(data) > 5 else data  # 只返回前5条数据作为示例
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取 ETF 数据失败: {str(e)}")


@router.get("/search", response_model=Dict[str, Any])
def search_etf(keyword: str = Query(..., description="搜索关键词（ETF名称或代码）")):
    """
    搜索 ETF
    """
    try:
        data = ETFService.search_etf(keyword)
        return {
            "status": "success",
            "total": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索 ETF 失败: {str(e)}")


@router.get("/{code}", response_model=Dict[str, Any])
def get_etf_by_code(code: str):
    """
    根据 ETF 代码获取详情
    """
    try:
        data = ETFService.get_etf_by_code(code)
        if not data:
            raise HTTPException(status_code=404, detail="ETF 不存在")
        return {
            "status": "success",
            "data": data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取 ETF 详情失败: {str(e)}")
