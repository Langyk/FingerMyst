// 股票数据类型
export interface StockData {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  high: number;
  low: number;
  open: number;
  close: number;
  turnover: number;
  pe: number;
  marketCap: number;
  industry: string;
  updateTime: string;
}

// 基金数据类型
export interface FundData {
  id: string;
  code: string;
  name: string;
  netValue: number;
  accumulatedValue: number;
  change: number;
  changePercent: number;
  scale: number;
  manager: string;
  type: string;
  riskLevel: string;
  establishDate: string;
  updateTime: string;
}

// 查询参数
export interface SearchParams {
  keyword: string;
  type: 'stock' | 'fund';
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

// 分页返回结果
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 数据类型
export type DataType = 'stock' | 'fund';

// 统计数据
export interface StatsData {
  totalCount: number;
  avgChange: number;
  positiveCount: number;
  negativeCount: number;
}

// 债券数据类型
export interface BondData {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  yield: number;
  duration: number;
  rating: string;
  issuer: string;
  maturityDate: string;
  updateTime: string;
}

// ETF数据类型
export interface EtfData {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  netAsset: number;
  trackingIndex: string;
  manager: string;
  expenseRatio: number;
  updateTime: string;
}

// 红利股票数据
export interface DividendStockData {
  id: string;
  code: string;
  name: string;
  price: number;
  changePercent: number;
  dividendYield: number;
  annualDividend: number;
  pe: number;
  pb: number;
  industry: string;
  updateTime: string;
}

// 证券信息（来自后端API）
export interface SecurityInfo {
  code: string;
  code_name: string;
  type: string;
  status: string;
}

// 证券类型选项
export interface SecurityType {
  code: string;
  name: string;
}

// 缓存状态
export interface CacheStatus {
  count: number;
  last_update: string;
}