import axios from 'axios';
import type { StockData, FundData, BondData, EtfData, DividendStockData, SearchParams, PageResult, StatsData, SecurityInfo, SecurityType, CacheStatus } from '../types';

const API_BASE_URL = '';

// 获取全部证券列表
export const getStockList = async (params: {
  force_refresh?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ total: number; data: SecurityInfo[] }> => {
  const response = await axios.get(`${API_BASE_URL}/api/stocks/all`, { params });
  return response.data;
};

// 搜索证券
export const searchStocks = async (params: {
  name?: string;
  code?: string;
  sec_type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ total: number; data: SecurityInfo[] }> => {
  const response = await axios.get(`${API_BASE_URL}/api/stocks/search`, { params });
  return response.data;
};

// 刷新缓存
export const refreshCache = async (): Promise<{ success: boolean; message: string; count: number }> => {
  const response = await axios.post(`${API_BASE_URL}/api/stocks/refresh-cache`);
  return response.data;
};

// 获取缓存状态
export const getCacheStatus = async (): Promise<CacheStatus> => {
  const response = await axios.get(`${API_BASE_URL}/api/stocks/cache-status`);
  return response.data;
};

// 获取证券类型列表
export const getSecurityTypes = async (): Promise<SecurityType[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/stocks/types`);
  return response.data;
};

// 获取上市状态列表
export const getStatusList = async (): Promise<SecurityType[]> => {
  const response = await axios.get(`${API_BASE_URL}/api/stocks/status-list`);
  return response.data;
};

// 生成随机数
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));

// 行业列表
const industries = ['科技', '金融', '消费', '医疗', '新能源', '地产', '工业', '农业', '传媒', '通信'];

// 基金经理列表
const managers = ['张伟', '李明', '王芳', '刘强', '陈静', '杨洋', '赵磊', '黄颖', '周涛', '吴磊'];

// 基金类型
const fundTypes = ['股票型', '混合型', '债券型', '指数型', '货币型'];

// 风险等级
const riskLevels = ['高风险', '中高风险', '中等风险', '中低风险', '低风险'];

// 股票名称库
const stockNames = [
  '贵州茅台', '宁德时代', '比亚迪', '招商银行', '中国平安',
  '美的集团', '恒瑞医药', '隆基绿能', '海康威视', '三一重工',
  '紫光国微', '中际旭创', '阳光电源', '天齐锂业', '赣锋锂业',
  '药明康德', '恒生电子', '金山办公', '海光信息', '中微公司',
  '拓普集团', '新易盛', '德赛西威', '华友钴业', '星途股份',
  '中航沈飞', '中国卫通', '中航资本', '洪都航空', '中航电子',
  '招商轮船', '中远海控', '中远海能', '中远海特', '中集集团',
  '中国国航', '南方航空', '东方航空', '海航控股', '春秋航空',
  '中国中铁', '中国铁建', '中国交建', '中国建筑', '中国中车',
  '中国电建', '中国能建', '中国中治', '中国化学', '中国核建'
];

// 基金名称库
const fundNames = [
  '易方达蓝筹精选', '富国天惠成长', '景顺长城新兴成长', '诺安成长混合', '易方达消费行业',
  '汇添富移动互联', '中欧医疗健康', '华夏新能源混合', '嘉实环保低碳', '南方创新成长',
  '广发科技先锋', '信达澳银新能源', '兴全合泰混合', '交银施罗德新生活', '银华心怡混合',
  '上投摩根中国优势', '华安成长创新', '易方达创新驱动', '富国创新趋势', '博时新兴消费',
  '鹏华新兴产业', '华泰柏瑞创新', '国泰智能汽车', '申万菱信新能源汽车', '前海开源清洁能源',
  '中银智能制造', '工银瑞信前沿医疗', '建信创新中国', '农银汇理新能源', '民生加银新兴成长'
];

// 生成模拟股票数据
const generateStocks = (): StockData[] => {
  return stockNames.map((name, index) => {
    const code = `${600000 + index}`;
    const open = random(10, 200);
    const close = open * random(0.95, 1.05);
    const change = close - open;
    const changePercent = (change / open) * 100;
    const volume = randomInt(100000, 50000000);
    const amount = volume * close;
    const high = Math.max(open, close) * random(1, 1.1);
    const low = Math.min(open, close) * random(0.9, 1);

    return {
      id: `stock-${index}`,
      code,
      name,
      price: Number(close.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume,
      amount: Number(amount.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      turnover: Number(random(1, 15).toFixed(2)),
      pe: Number(random(5, 100).toFixed(2)),
      marketCap: Number(random(10, 500).toFixed(2)),
      industry: industries[index % industries.length],
      updateTime: new Date().toISOString()
    };
  });
};

// 生成模拟基金数据
const generateFunds = (): FundData[] => {
  return fundNames.map((name, index) => {
    const code = `${160000 + index}`;
    const netValue = random(0.5, 5);
    const accumulatedValue = netValue * random(1, 3);
    const change = random(-0.05, 0.05);
    const changePercent = (change / netValue) * 100;

    return {
      id: `fund-${index}`,
      code,
      name,
      netValue: Number(netValue.toFixed(4)),
      accumulatedValue: Number(accumulatedValue.toFixed(4)),
      change: Number(change.toFixed(4)),
      changePercent: Number(changePercent.toFixed(2)),
      scale: Number(random(1, 200).toFixed(2)),
      manager: managers[index % managers.length],
      type: fundTypes[index % fundTypes.length],
      riskLevel: riskLevels[index % riskLevels.length],
      establishDate: `${2010 + randomInt(0, 14)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      updateTime: new Date().toISOString()
    };
  });
};

// 缓存数据
const stockData = generateStocks();
const fundData = generateFunds();

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 股票查询接口
export const queryStocks = async (params: SearchParams): Promise<PageResult<StockData>> => {
  await delay(300);

  let list = [...stockData];

  // 搜索过滤
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(item =>
      item.code.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword)
    );
  }

  // 排序
  if (params.sortField && params.sortOrder) {
    list.sort((a, b) => {
      const aVal = a[params.sortField as keyof StockData];
      const bVal = b[params.sortField as keyof StockData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return params.sortOrder === 'ascend' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  // 分页
  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  const pagedList = list.slice(start, start + params.pageSize);

  return {
    list: pagedList,
    total,
    page: params.page,
    pageSize: params.pageSize
  };
};

// 基金查询接口
export const queryFunds = async (params: SearchParams): Promise<PageResult<FundData>> => {
  await delay(300);

  let list = [...fundData];

  // 搜索过滤
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(item =>
      item.code.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword)
    );
  }

  // 排序
  if (params.sortField && params.sortOrder) {
    list.sort((a, b) => {
      const aVal = a[params.sortField as keyof FundData];
      const bVal = b[params.sortField as keyof FundData];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return params.sortOrder === 'ascend' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  // 分页
  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  const pagedList = list.slice(start, start + params.pageSize);

  return {
    list: pagedList,
    total,
    page: params.page,
    pageSize: params.pageSize
  };
};

// 获取股票统计数据
export const getStockStats = async (): Promise<StatsData> => {
  const totalCount = stockData.length;
  const avgChange = stockData.reduce((sum, item) => sum + item.changePercent, 0) / totalCount;
  const positiveCount = stockData.filter(item => item.changePercent > 0).length;
  const negativeCount = stockData.filter(item => item.changePercent < 0).length;

  return {
    totalCount,
    avgChange: Number(avgChange.toFixed(2)),
    positiveCount,
    negativeCount
  };
};

// 获取基金统计数据
export const getFundStats = async (): Promise<StatsData> => {
  const totalCount = fundData.length;
  const avgChange = fundData.reduce((sum, item) => sum + item.changePercent, 0) / totalCount;
  const positiveCount = fundData.filter(item => item.changePercent > 0).length;
  const negativeCount = fundData.filter(item => item.changePercent < 0).length;

  return {
    totalCount,
    avgChange: Number(avgChange.toFixed(2)),
    positiveCount,
    negativeCount
  };
};

// 通用查询接口
export const queryData = async (params: SearchParams): Promise<PageResult<StockData | FundData>> => {
  if (params.type === 'stock') {
    return queryStocks(params) as Promise<PageResult<StockData | FundData>>;
  }
  return queryFunds(params) as Promise<PageResult<StockData | FundData>>;
};

// ============ 债券数据 ============

// 债券名称库
const bondNames = [
  '国债010107', '国债010113', '国债010115', '国债110002', '国债110007',
  '国债120005', '国债130005', '国债140005', '国债150005', '国债160007',
  '国债170006', '国债180005', '国债190003', '国债210005', '国债220005',
  '企业债010301', '企业债010302', '企业债010303', '企业债110101', '企业债110102',
  '企业债120201', '企业债130102', '企业债140201', '企业债150102', '企业债160102'
];

// 评级列表
const ratings = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A'];
const issuers = ['财政部', '国家电网', '中国石化', '中国石油', '中国银行', '建设银行', '工商银行', '农业银行', '交通银行', '招商银行'];

const generateBonds = (): BondData[] => {
  return bondNames.map((name, index) => {
    const code = `1100${index}`;
    const price = random(95, 105);
    const change = random(-0.5, 0.5);
    return {
      id: `bond-${index}`,
      code,
      name,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number((change / price * 100).toFixed(2)),
      yield: Number(random(2, 5).toFixed(2)),
      duration: Number(random(1, 10).toFixed(2)),
      rating: ratings[index % ratings.length],
      issuer: issuers[index % issuers.length],
      maturityDate: `${2025 + randomInt(0, 10)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      updateTime: new Date().toISOString()
    };
  });
};

// ============ ETF数据 ============

const etfNames = [
  '沪深300ETF', '上证50ETF', '中证500ETF', '创业板ETF', '科创50ETF',
  '证券ETF', '军工ETF', '券商ETF', '新能源ETF', '半导体ETF',
  '医疗ETF', '消费ETF', '金融ETF', '地产ETF', '环保ETF',
  '信息技术ETF', '人工智能ETF', '5GETF', '光伏ETF', '电力ETF',
  '农业ETF', '传媒ETF', '通信ETF', '汽车ETF', '化工ETF',
  '煤炭ETF', '有色ETF', '钢铁ETF', '医药ETF', '建筑ETF'
];

const trackingIndexes = ['沪深300', '上证50', '中证500', '创业板指', '科创50', '中证1000', '中证全指'];

const generateEtfs = (): EtfData[] => {
  return etfNames.map((name, index) => {
    const code = `${510000 + index}`;
    const price = random(0.5, 5);
    const change = random(-0.1, 0.1);
    return {
      id: `etf-${index}`,
      code,
      name,
      price: Number(price.toFixed(4)),
      change: Number(change.toFixed(4)),
      changePercent: Number((change / price * 100).toFixed(2)),
      volume: randomInt(100000, 10000000),
      amount: randomInt(1000000, 100000000),
      netAsset: Number(random(1, 500).toFixed(2)),
      trackingIndex: trackingIndexes[index % trackingIndexes.length],
      manager: managers[index % managers.length],
      expenseRatio: Number(random(0.1, 1).toFixed(2)),
      updateTime: new Date().toISOString()
    };
  });
};

// ============ 红利股票数据 ============

const dividendStockNames = [
  '中国银行', '工商银行', '建设银行', '农业银行', '交通银行',
  '招商银行', '中国平安', '中国石化', '中国石油', '中国神华',
  '大秦铁路', '上海机场', '宁沪高速', '山东高速', '粤高速A',
  '长江电力', '华能水电', '国投电力', '华电国际', '大唐发电',
  '中国电信', '中国移动', '中国联通', '上海银行', '江苏银行',
  '杭州银行', '南京银行', '宁波银行', '兴业银行', '民生银行'
];

const generateDividendStocks = (): DividendStockData[] => {
  return dividendStockNames.map((name, index) => {
    const code = `${601000 + index}`;
    const price = random(5, 50);
    const dividendYield = random(2, 8);
    const annualDividend = price * dividendYield / 100;
    return {
      id: `dividend-${index}`,
      code,
      name,
      price: Number(price.toFixed(2)),
      changePercent: Number(random(-3, 3).toFixed(2)),
      dividendYield: Number(dividendYield.toFixed(2)),
      annualDividend: Number(annualDividend.toFixed(2)),
      pe: Number(random(5, 20).toFixed(2)),
      pb: Number(random(0.5, 3).toFixed(2)),
      industry: industries[index % industries.length],
      updateTime: new Date().toISOString()
    };
  });
};

// 缓存数据
const bondData = generateBonds();
const etfData = generateEtfs();
const dividendStockData = generateDividendStocks();

// 债券查询
export const queryBonds = async (params: SearchParams): Promise<PageResult<BondData>> => {
  await delay(300);
  let list = [...bondData];
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(item => item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword));
  }
  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  return { list: list.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
};

// ETF查询
export const queryEtfs = async (params: SearchParams): Promise<PageResult<EtfData>> => {
  await delay(300);
  let list = [...etfData];
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(item => item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword));
  }
  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  return { list: list.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
};

// 红利股票查询
export const queryDividendStocks = async (params: SearchParams): Promise<PageResult<DividendStockData>> => {
  await delay(300);
  let list = [...dividendStockData];
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(item => item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword));
  }
  // 按股息率排序
  list.sort((a, b) => b.dividendYield - a.dividendYield);
  const total = list.length;
  const start = (params.page - 1) * params.pageSize;
  return { list: list.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize };
};

// 债券统计
export const getBondStats = async (): Promise<StatsData> => {
  const totalCount = bondData.length;
  const avgChange = bondData.reduce((sum, item) => sum + item.changePercent, 0) / totalCount;
  const positiveCount = bondData.filter(item => item.changePercent > 0).length;
  const negativeCount = bondData.filter(item => item.changePercent < 0).length;
  return { totalCount, avgChange: Number(avgChange.toFixed(2)), positiveCount, negativeCount };
};

// ETF统计
export const getEtfStats = async (): Promise<StatsData> => {
  const totalCount = etfData.length;
  const avgChange = etfData.reduce((sum, item) => sum + item.changePercent, 0) / totalCount;
  const positiveCount = etfData.filter(item => item.changePercent > 0).length;
  const negativeCount = etfData.filter(item => item.changePercent < 0).length;
  return { totalCount, avgChange: Number(avgChange.toFixed(2)), positiveCount, negativeCount };
};

// 红利股票统计
export const getDividendStats = async (): Promise<StatsData> => {
  const totalCount = dividendStockData.length;
  const avgYield = dividendStockData.reduce((sum, item) => sum + item.dividendYield, 0) / totalCount;
  const positiveCount = dividendStockData.filter(item => item.changePercent > 0).length;
  const negativeCount = dividendStockData.filter(item => item.changePercent < 0).length;
  return { totalCount, avgChange: Number(avgYield.toFixed(2)), positiveCount, negativeCount };
};