import akshare as ak
from typing import List, Dict, Any


class ETFService:
    """ETF 数据服务"""

    @staticmethod
    def get_etf_spot_data() -> List[Dict[str, Any]]:
        """
        获取东方财富网 ETF 实时行情数据
        使用 akshare 的 fund_etf_spot_em 函数
        """
        try:
            df = ak.fund_etf_spot_em()
            # 将 DataFrame 转换为字典列表
            records = df.to_dict('records')
            return records
        except Exception as e:
            print(f"获取 ETF 数据失败: {e}")
            return []

    @staticmethod
    def get_etf_by_code(code: str) -> Dict[str, Any]:
        """根据 ETF 代码获取详情"""
        try:
            df = ak.fund_etf_spot_em()
            etf_data = df[df['代码'] == code]
            if etf_data.empty:
                return {}
            return etf_data.to_dict('records')[0]
        except Exception as e:
            print(f"获取 ETF 详情失败: {e}")
            return {}

    @staticmethod
    def search_etf(keyword: str) -> List[Dict[str, Any]]:
        """搜索 ETF（按名称或代码）"""
        try:
            df = ak.fund_etf_spot_em()
            # 按名称或代码搜索
            mask = df['名称'].str.contains(keyword, na=False) | \
                   df['代码'].str.contains(keyword, na=False)
            result = df[mask]
            return result.to_dict('records')
        except Exception as e:
            print(f"搜索 ETF 失败: {e}")
            return []
