"""API endpoints for securities information."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.schemas.stock import (
    StockBasic, StockListResponse, StockTypeInfo,
    StockStatusInfo, CacheStatusResponse
)
from app.services import stock_service


router = APIRouter()


@router.get("/all", response_model=StockListResponse, summary="获取全部证券信息")
def get_all_securities(
    force_refresh: bool = Query(False, description="强制从API刷新数据")
):
    """获取全部证券信息。

    首次调用会从 baostock API 获取数据并缓存到本地。
    后续调用会直接从缓存读取，缓存有效期为24小时。

    - force_refresh=true: 强制从API刷新缓存
    """
    try:
        if force_refresh:
            data = stock_service._fetch_from_api()
            stock_service._write_to_cache(data)
        else:
            data = stock_service.get_all_securities()

        return {
            "total": len(data),
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search", response_model=StockListResponse, summary="搜索证券")
def search_securities(
    name: Optional[str] = Query(None, description="证券名称(模糊搜索)"),
    code: Optional[str] = Query(None, description="证券代码(模糊搜索)"),
    sec_type: Optional[str] = Query(None, description="证券类型: 1-股票, 2-指数, 3-其它, 4-可转债, 5-ETF"),
    status: Optional[str] = Query(None, description="上市状态: 1-上市, 0-退市")
):
    """搜索证券信息。

    所有参数均为可选，证券名称和代码支持模糊搜索。
    多个筛选条件使用 AND 逻辑组合。

    **证券类型说明:**
    - 1: 股票
    - 2: 指数
    - 3: 其它
    - 4: 可转债
    - 5: ETF

    **上市状态说明:**
    - 1: 上市
    - 0: 退市
    """
    try:
        results = stock_service.search_securities(
            name=name,
            code=code,
            sec_type=sec_type,
            status=status
        )
        return {
            "total": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh-cache", summary="刷新缓存")
def refresh_cache():
    """强制从 baostock API 刷新缓存数据。

    返回:
    - success: 是否刷新成功
    - count: 缓存的证券数量
    """
    try:
        success = stock_service.refresh_cache()
        if success:
            status = stock_service.get_cache_status()
            return {
                "success": True,
                "message": "缓存刷新成功",
                "count": status.get("count", 0)
            }
        else:
            raise HTTPException(status_code=500, detail="缓存刷新失败")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cache-status", response_model=CacheStatusResponse, summary="获取缓存状态")
def get_cache_status():
    """获取当前缓存的状态信息。"""
    return stock_service.get_cache_status()


@router.get("/types", response_model=list[StockTypeInfo], summary="获取证券类型列表")
def get_security_types():
    """获取所有支持的证券类型。"""
    return [
        {"code": "1", "name": "股票"},
        {"code": "2", "name": "指数"},
        {"code": "3", "name": "其它"},
        {"code": "4", "name": "可转债"},
        {"code": "5", "name": "ETF"}
    ]


@router.get("/status-list", response_model=list[StockStatusInfo], summary="获取上市状态列表")
def get_status_list():
    """获取所有支持的上市状态。"""
    return [
        {"code": "1", "name": "上市"},
        {"code": "0", "name": "退市"}
    ]
