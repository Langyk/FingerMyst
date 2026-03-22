import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, message, Row, Col, Statistic, Tag, Table, Select, Button, Space, Input } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, BankOutlined, FundOutlined, FileTextOutlined, StarOutlined, ThunderboltOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import SearchBar from '../../components/SearchBar';
import Sidebar from '../../components/Sidebar';
import { queryBonds, queryEtfs, queryDividendStocks, getStockStats, getFundStats, getBondStats, getEtfStats, getDividendStats, searchStocks, getSecurityTypes, getStatusList, refreshCache, getCacheStatus } from '../../api';
import type { BondData, EtfData, DividendStockData, StatsData, SearchParams, SecurityInfo, SecurityType } from '../../types';

const { Title, Text } = Typography;
const { Content } = Layout;

// 品牌 Logo Header
const BrandHeader: React.FC<{ title?: string }> = ({ title }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.2)',
    marginBottom: '24px'
  }}>
    <img src="/logo.svg" alt="FingerMyst" style={{ width: '48px', height: '48px' }} />
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Title level={4} style={{ margin: 0, color: '#e9d5ff', fontFamily: 'serif' }}>指典秘境</Title>
        <Text style={{ color: '#a78bfa', fontSize: '14px', fontStyle: 'italic' }}>FingerMyst</Text>
      </div>
      <Text style={{ color: '#9ca3af', fontSize: '11px' }}>{title || '金融终端数据查询'}</Text>
    </div>
  </div>
);

// 证券汇总面板（使用真实API）
const BrokerPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SecurityInfo[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [searchName, setSearchName] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [secType, setSecType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [securityTypes, setSecurityTypes] = useState<SecurityType[]>([]);
  const [statusList, setStatusList] = useState<SecurityType[]>([]);
  const [cacheStatus, setCacheStatus] = useState<{ count: number; last_update: string } | null>(null);

  // 静态备用映射
  const staticSecTypes: Record<string, string> = { '1': '股票', '2': '指数', '3': '其它', '4': '可转债', '5': 'ETF' };
  const staticStatus: Record<string, string> = { '1': '上市', '0': '退市' };

  // 证券类型名称获取（优先使用 API 数据，否则使用静态映射）
  const getSecTypeName = (code: string) => {
    // 优先从 API 数据中查找
    if (securityTypes.length > 0) {
      const found = securityTypes.find(t => t.code === code);
      if (found) return found.name;
    }
    // 使用静态映射
    return staticSecTypes[code] || code;
  };
  const getStatusName = (code: string) => {
    if (statusList.length > 0) {
      const found = statusList.find(s => s.code === code);
      if (found) return found.name;
    }
    return staticStatus[code] || code;
  };

  // 加载筛选选项
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [types, statuses, cache] = await Promise.all([
          getSecurityTypes(),
          getStatusList(),
          getCacheStatus()
        ]);
        setSecurityTypes(types);
        setStatusList(statuses);
        setCacheStatus(cache);
      } catch (error) {
        console.error('加载选项失败:', error);
      }
    };
    loadOptions();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        name: searchName || undefined,
        code: searchCode || undefined,
        sec_type: secType,
        status: status,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };

      const result = await searchStocks(params);
      setData(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (error) {
      message.error('数据加载失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [searchName, searchCode, secType, status, pagination.current, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefreshCache = async () => {
    try {
      message.loading({ content: '正在更新证券...', key: 'refresh' });
      const result = await refreshCache();
      message.success({ content: result.message, key: 'refresh' });
      fetchData();
      // 更新缓存状态
      const cache = await getCacheStatus();
      setCacheStatus(cache);
    } catch (error) {
      message.error('缓存刷新失败');
    }
  };

  const columns = [
    { title: '代码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '名称', dataIndex: 'code_name', key: 'code_name', width: 150 },
    {
      title: '证券类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (v: string) => {
        const typeName = getSecTypeName(String(v));
        const color = v === '1' ? 'blue' : v === '5' ? 'green' : v === '4' ? 'orange' : 'default';
        return <Tag color={color}>{typeName}</Tag>;
      }
    },
    {
      title: '上市状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: string) => {
        const statusName = getStatusName(String(v));
        return <Tag color={v === '1' ? 'success' : 'error'}>{statusName}</Tag>;
      }
    },
  ];

  return (
    <div>
      <BrandHeader title="证券汇总" />
      <Card>
        {/* 搜索区域 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Input placeholder="证券名称" value={searchName} onChange={e => setSearchName(e.target.value)} onPressEnter={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }} style={{ width: 150 }} />
          </Col>
          <Col>
            <Input placeholder="证券代码" value={searchCode} onChange={e => setSearchCode(e.target.value)} onPressEnter={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }} style={{ width: 150 }} />
          </Col>
          <Col>
            <Select
              placeholder="证券类型"
              allowClear
              value={secType}
              onChange={(v) => { setSecType(v); setPagination(p => ({ ...p, current: 1 })); }}
              style={{ width: 120 }}
              options={securityTypes.map(t => ({ label: t.name, value: t.code }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="上市状态"
              allowClear
              value={status}
              onChange={(v) => { setStatus(v); setPagination(p => ({ ...p, current: 1 })); }}
              style={{ width: 100 }}
              options={statusList.map(s => ({ label: s.name, value: s.code }))}
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }}>搜索</Button>
              <Button onClick={() => {
                setSearchName('');
                setSearchCode('');
                setSecType(undefined);
                setStatus(undefined);
                setPagination(p => ({ ...p, current: 1 }));
                fetchData();
                setStatus(undefined);
                setPagination(p => ({ ...p, current: 1 }));
              }}>重置</Button>
              <Button icon={<SyncOutlined />} onClick={handleRefreshCache}>更新证券</Button>
              </Space>
          </Col>
        </Row>

        {/* 统计信息 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}><Card size="small"><Statistic title="证券总数" value={pagination.total} valueStyle={{ color: '#1890ff' }} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="股票数量" value={data.filter(d => d.type === '1').length} valueStyle={{ color: '#1890ff' }} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="ETF数量" value={data.filter(d => d.type === '5').length} valueStyle={{ color: '#52c41a' }} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="上市数量" value={data.filter(d => d.status === '1').length} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey="code"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (t: number) => `共 ${t} 条`,
            onChange: (page, pageSize) => setPagination(p => ({ ...p, current: page, pageSize }))
          }}
          scroll={{ x: 500 }}
        />
      </Card>
    </div>
  );
};

// 债券基金面板
const BondPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<BondData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: SearchParams = { keyword, type: 'stock', page: pagination.current, pageSize: pagination.pageSize };
      const [dataResult, statsResult] = await Promise.all([queryBonds(params), getBondStats()]);
      setData(dataResult.list);
      setStats(statsResult);
      setPagination(prev => ({ ...prev, total: dataResult.total }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, pagination.current, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { title: '代码', dataIndex: 'code', key: 'code', width: 90 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '价格', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => v.toFixed(2) },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 100, render: (v: number) => <span style={{ color: v > 0 ? '#ff4d4f' : '#52c41a' }}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</span> },
    { title: '到期收益率', dataIndex: 'yield', key: 'yield', width: 100, render: (v: number) => <span style={{ color: '#faad14' }}>{v.toFixed(2)}%</span> },
    { title: '久期', dataIndex: 'duration', key: 'duration', width: 80, render: (v: number) => v.toFixed(1) },
    { title: '评级', dataIndex: 'rating', key: 'rating', width: 80, render: (v: string) => <Tag color={v === 'AAA' ? 'green' : v === 'AA+' ? 'blue' : 'orange'}>{v}</Tag> },
    { title: '发行人', dataIndex: 'issuer', key: 'issuer', width: 100 },
    { title: '到期日', dataIndex: 'maturityDate', key: 'maturityDate', width: 100 },
  ];

  return (
    <div>
      <BrandHeader title="债券基金" />
      <Card>
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} onSearch={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }} onReset={() => { setKeyword(''); setPagination(p => ({ ...p, current: 1 })); fetchData(); }} dataType="stock" onDataTypeChange={() => {}} showTypeSwitch={false} />
        {stats && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="债券数量" value={stats.totalCount} valueStyle={{ color: '#1890ff' }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="平均涨跌" value={stats.avgChange} precision={2} valueStyle={{ color: stats.avgChange > 0 ? '#ff4d4f' : '#52c41a' }} suffix="%" /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="上涨" value={stats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="下跌" value={stats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
          </Row>
        )}
        <Table loading={loading} columns={columns} dataSource={data} rowKey="id" pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }} scroll={{ x: 900 }} />
      </Card>
    </div>
  );
};

// 红利基金面板
const DividendPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<DividendStockData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: SearchParams = { keyword, type: 'stock', page: pagination.current, pageSize: pagination.pageSize };
      const [dataResult, statsResult] = await Promise.all([queryDividendStocks(params), getDividendStats()]);
      setData(dataResult.list);
      setStats(statsResult);
      setPagination(prev => ({ ...prev, total: dataResult.total }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, pagination.current, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { title: '代码', dataIndex: 'code', key: 'code', width: 90 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
    { title: '现价', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => v.toFixed(2) },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 100, render: (v: number) => <span style={{ color: v > 0 ? '#ff4d4f' : '#52c41a' }}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</span> },
    { title: '股息率', dataIndex: 'dividendYield', key: 'dividendYield', width: 100, render: (v: number) => <span style={{ color: '#faad14', fontWeight: 'bold' }}>{v.toFixed(2)}%</span> },
    { title: '年分红', dataIndex: 'annualDividend', key: 'annualDividend', width: 80, render: (v: number) => v.toFixed(2) },
    { title: '市盈率', dataIndex: 'pe', key: 'pe', width: 80, render: (v: number) => v.toFixed(2) },
    { title: '市净率', dataIndex: 'pb', key: 'pb', width: 80, render: (v: number) => v.toFixed(2) },
    { title: '行业', dataIndex: 'industry', key: 'industry', width: 80, render: (v: string) => <Tag color="purple">{v}</Tag> },
  ];

  return (
    <div>
      <BrandHeader title="红利基金" />
      <Card>
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} onSearch={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }} onReset={() => { setKeyword(''); setPagination(p => ({ ...p, current: 1 })); fetchData(); }} dataType="stock" onDataTypeChange={() => {}} showTypeSwitch={false} />
        {stats && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="高股息股票" value={stats.totalCount} valueStyle={{ color: '#faad14' }} prefix={<StarOutlined />} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="平均股息率" value={stats.avgChange} precision={2} valueStyle={{ color: '#faad14' }} suffix="%" /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="上涨" value={stats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="下跌" value={stats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
          </Row>
        )}
        <Table loading={loading} columns={columns} dataSource={data} rowKey="id" pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }} scroll={{ x: 850 }} />
      </Card>
    </div>
  );
};

// ETF基金面板
const EtfPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<EtfData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: SearchParams = { keyword, type: 'stock', page: pagination.current, pageSize: pagination.pageSize };
      const [dataResult, statsResult] = await Promise.all([queryEtfs(params), getEtfStats()]);
      setData(dataResult.list);
      setStats(statsResult);
      setPagination(prev => ({ ...prev, total: dataResult.total }));
    } catch (error) {
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [keyword, pagination.current, pagination.pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { title: '代码', dataIndex: 'code', key: 'code', width: 90 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '价格', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => v.toFixed(4) },
    { title: '涨跌幅', dataIndex: 'changePercent', key: 'changePercent', width: 100, render: (v: number) => <span style={{ color: v > 0 ? '#ff4d4f' : v < 0 ? '#52c41a' : '#999' }}>{v > 0 ? '+' : ''}{v.toFixed(2)}%</span> },
    { title: '成交量', dataIndex: 'volume', key: 'volume', width: 100, render: (v: number) => `${(v / 10000).toFixed(0)}万` },
    { title: '成交额', dataIndex: 'amount', key: 'amount', width: 100, render: (v: number) => `${(v / 100000000).toFixed(2)}亿` },
    { title: '规模', dataIndex: 'netAsset', key: 'netAsset', width: 100, render: (v: number) => `${v.toFixed(2)}亿` },
    { title: '跟踪指数', dataIndex: 'trackingIndex', key: 'trackingIndex', width: 100 },
    { title: '费率', dataIndex: 'expenseRatio', key: 'expenseRatio', width: 80, render: (v: number) => `${v.toFixed(2)}%` },
    { title: '经理', dataIndex: 'manager', key: 'manager', width: 80 },
  ];

  return (
    <div>
      <BrandHeader title="ETF基金" />
      <Card>
        <SearchBar keyword={keyword} onKeywordChange={setKeyword} onSearch={() => { setPagination(p => ({ ...p, current: 1 })); fetchData(); }} onReset={() => { setKeyword(''); setPagination(p => ({ ...p, current: 1 })); fetchData(); }} dataType="stock" onDataTypeChange={() => {}} showTypeSwitch={false} />
        {stats && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="ETF数量" value={stats.totalCount} valueStyle={{ color: '#1890ff' }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="平均涨跌" value={stats.avgChange} precision={2} valueStyle={{ color: stats.avgChange > 0 ? '#ff4d4f' : '#52c41a' }} suffix="%" /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="上涨" value={stats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="下跌" value={stats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Card></Col>
          </Row>
        )}
        <Table loading={loading} columns={columns} dataSource={data} rowKey="id" pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, showSizeChanger: true, showTotal: (t: number) => `共 ${t} 条` }} scroll={{ x: 1100 }} />
      </Card>
    </div>
  );
};

// 数据分析面板
const AnalysisPanel: React.FC = () => {
  const [stockStats, setStockStats] = useState<StatsData | null>(null);
  const [fundStats, setFundStats] = useState<StatsData | null>(null);
  const [bondStats, setBondStats] = useState<StatsData | null>(null);

  useEffect(() => {
    Promise.all([getStockStats(), getFundStats(), getBondStats()]).then(([s, f, b]) => {
      setStockStats(s);
      setFundStats(f);
      setBondStats(b);
    });
  }, []);

  return (
    <div>
      <BrandHeader title="数据分析" />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={<><BankOutlined /> 股票市场概况</>} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            {stockStats && (
              <Row gutter={16}>
                <Col span={12}><Statistic title="股票数量" value={stockStats.totalCount} valueStyle={{ color: '#1890ff' }} /></Col>
                <Col span={12}><Statistic title="平均涨跌幅" value={stockStats.avgChange} precision={2} valueStyle={{ color: stockStats.avgChange > 0 ? '#ff4d4f' : '#52c41a' }} suffix="%" prefix={stockStats.avgChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} /></Col>
                <Col span={12}><Statistic title="上涨" value={stockStats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Col>
                <Col span={12}><Statistic title="下跌" value={stockStats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Col>
              </Row>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<><FundOutlined /> 基金市场概况</>} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            {fundStats && (
              <Row gutter={16}>
                <Col span={12}><Statistic title="基金数量" value={fundStats.totalCount} valueStyle={{ color: '#1890ff' }} /></Col>
                <Col span={12}><Statistic title="平均涨跌幅" value={fundStats.avgChange} precision={2} valueStyle={{ color: fundStats.avgChange > 0 ? '#ff4d4f' : '#52c41a' }} suffix="%" prefix={fundStats.avgChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} /></Col>
                <Col span={12}><Statistic title="上涨" value={fundStats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Col>
                <Col span={12}><Statistic title="下跌" value={fundStats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Col>
              </Row>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<><FileTextOutlined /> 债券市场概况</>} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            {bondStats && (
              <Row gutter={16}>
                <Col span={12}><Statistic title="债券数量" value={bondStats.totalCount} valueStyle={{ color: '#1890ff' }} /></Col>
                <Col span={12}><Statistic title="平均涨跌幅" value={bondStats.avgChange} precision={2} valueStyle={{ color: bondStats.avgChange > 0 ? '#ff4d4f' : '#52c41a' }} suffix="%" prefix={bondStats.avgChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} /></Col>
                <Col span={12}><Statistic title="上涨" value={bondStats.positiveCount} valueStyle={{ color: '#ff4d4f' }} /></Col>
                <Col span={12}><Statistic title="下跌" value={bondStats.negativeCount} valueStyle={{ color: '#52c41a' }} /></Col>
              </Row>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={<><ThunderboltOutlined /> 快速统计</>} style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            <Row gutter={16}>
              <Col span={12}><Statistic title="总产品数" value={251} valueStyle={{ color: '#7c3aed' }} /></Col>
              <Col span={12}><Statistic title="数据类型" value={5} valueStyle={{ color: '#7c3aed' }} /></Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('broker');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'broker': return <BrokerPanel />;
      case 'bond': return <BondPanel />;
      case 'dividend': return <DividendPanel />;
      case 'etf': return <EtfPanel />;
      case 'analysis': return <AnalysisPanel />;
      default: return <BrokerPanel />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      <Sidebar selectedKey={selectedMenu} onSelect={setSelectedMenu} />
      <Content style={{ padding: '24px', overflow: 'auto', background: '#0f0f1a', minHeight: '100vh' }}>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default Dashboard;