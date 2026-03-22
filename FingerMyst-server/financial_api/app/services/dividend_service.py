from typing import Optional, List
from app.schemas.dividend import DividendIndex

# 模拟红利指数数据
MOCK_DIVIDEND_INDICES = [
    DividendIndex(index_id="000015", name="上证红利", close=2980.56, dividend_yield=5.82, pe=6.5, pb=0.78, change_pct=0.15),
    DividendIndex(index_id="000922", name="中证红利", close=3456.78, dividend_yield=4.95, pe=7.2, pb=0.92, change_pct=0.28),
    DividendIndex(index_id="399306", name="深证红利", close=4523.12, dividend_yield=3.68, pe=9.5, pb=1.25, change_pct=-0.12),
    DividendIndex(index_id="000002", name="上证180红利", close=5120.34, dividend_yield=4.56, pe=7.8, pb=0.85, change_pct=0.35),
    DividendIndex(index_id="399963", name="中证500红利", close=2156.89, dividend_yield=6.12, pe=5.8, pb=0.68, change_pct=0.42),
    DividendIndex(index_id="000089", name="红利低波", close=3890.45, dividend_yield=5.45, pe=6.2, pb=0.75, change_pct=0.22),
    DividendIndex(index_id="931142", name="中证红利潜力", close=1234.56, dividend_yield=4.28, pe=8.5, pb=1.15, change_pct=-0.08),
    DividendIndex(index_id="930955", name="红利质量", close=2156.78, dividend_yield=3.92, pe=10.2, pb=1.35, change_pct=0.18),
]


class DividendIndexService:
    @staticmethod
    def get_all_dividend_indices() -> List[DividendIndex]:
        """获取所有红利指数列表"""
        return MOCK_DIVIDEND_INDICES

    @staticmethod
    def get_dividend_index_by_id(index_id: str) -> Optional[DividendIndex]:
        """根据指数代码获取红利指数详情"""
        for index in MOCK_DIVIDEND_INDICES:
            if index.index_id == index_id:
                return index
        return None

    @staticmethod
    def search_dividend_indices(keyword: str) -> List[DividendIndex]:
        """搜索红利指数"""
        return [
            index for index in MOCK_DIVIDEND_INDICES
            if keyword.lower() in index.name.lower() or keyword in index.index_id
        ]

    @staticmethod
    def get_high_dividend_indices(min_yield: float = 4.0) -> List[DividendIndex]:
        """获取高股息率指数"""
        return [
            index for index in MOCK_DIVIDEND_INDICES
            if index.dividend_yield and index.dividend_yield >= min_yield
        ]