from typing import Optional, List
from app.schemas.bond import Bond

# 模拟债券数据
MOCK_BONDS = [
    Bond(bond_id="110007", name="国债110007", yield_rate=2.85, rating="AAA", price=100.5, change_pct=0.02),
    Bond(bond_id="113052", name="国债113052", yield_rate=2.65, rating="AAA", price=99.8, change_pct=-0.01),
    Bond(bond_id="128013", name="可转债128013", yield_rate=1.85, rating="AA+", price=108.2, change_pct=0.15),
    Bond(bond_id="127012", name="可转债127012", yield_rate=0.95, rating="AA", price=102.5, change_pct=0.08),
    Bond(bond_id="113511", name="企业债113511", yield_rate=3.45, rating="AA+", price=101.2, change_pct=-0.05),
]

class BondService:
    @staticmethod
    def get_all_bonds() -> List[Bond]:
        """获取所有债券列表"""
        return MOCK_BONDS

    @staticmethod
    def get_bond_by_id(bond_id: str) -> Optional[Bond]:
        """根据债券代码获取详情"""
        for bond in MOCK_BONDS:
            if bond.bond_id == bond_id:
                return bond
        return None

    @staticmethod
    def search_bonds(keyword: str) -> List[Bond]:
        """搜索债券"""
        return [
            bond for bond in MOCK_BONDS
            if keyword.lower() in bond.name.lower() or keyword in bond.bond_id
        ]