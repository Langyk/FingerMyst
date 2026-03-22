from typing import Optional, List
from app.schemas.index import Index

# 模拟指数数据
MOCK_INDICES = [
    Index(index_id="000001", name="上证指数", close=3425.89, open=3410.23, high=3432.15, low=3405.67, change_pct=0.45, volume=3856000000),
    Index(index_id="399001", name="深证成指", close=11245.67, open=11210.45, high=11280.32, low=11195.23, change_pct=0.32, volume=4567000000),
    Index(index_id="399006", name="创业板指", close=2256.78, open=2245.89, high=2265.34, low=2240.12, change_pct=0.58, volume=1890000000),
    Index(index_id="000300", name="沪深300", close=4205.34, open=4190.12, high=4215.67, low=4185.23, change_pct=0.38, volume=2150000000),
    Index(index_id="000905", name="中证500", close=6356.78, open=6340.56, high=6380.23, low=6335.89, change_pct=0.25, volume=1520000000),
]

class IndexService:
    @staticmethod
    def get_all_indices() -> List[Index]:
        """获取所有指数列表"""
        return MOCK_INDICES

    @staticmethod
    def get_index_by_id(index_id: str) -> Optional[Index]:
        """根据指数代码获取详情"""
        for index in MOCK_INDICES:
            if index.index_id == index_id:
                return index
        return None

    @staticmethod
    def search_indices(keyword: str) -> List[Index]:
        """搜索指数"""
        return [
            index for index in MOCK_INDICES
            if keyword.lower() in index.name.lower() or keyword in index.index_id
        ]