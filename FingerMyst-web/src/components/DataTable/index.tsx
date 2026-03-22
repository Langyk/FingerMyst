import React from 'react';
import { Table, Tag, Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd/es/table';
import type { StockData, FundData, StatsData, DataType } from '../../types';

interface DataTableProps {
  loading: boolean;
  dataType: DataType;
  data: (StockData | FundData)[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  stats: StatsData | null;
  onTableChange: TableProps<StockData | FundData>['onChange'];
}

const StockColumns: ColumnsType<StockData> = [
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
    width: 100,
    fixed: 'left',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left',
  },
  {
    title: '现价',
    dataIndex: 'price',
    key: 'price',
    width: 100,
    sorter: true,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '涨跌幅',
    dataIndex: 'changePercent',
    key: 'changePercent',
    width: 120,
    sorter: true,
    render: (value: number) => {
      const color = value > 0 ? '#ff4d4f' : value < 0 ? '#52c41a' : '#999';
      const icon = value > 0 ? <ArrowUpOutlined /> : value < 0 ? <ArrowDownOutlined /> : null;
      return (
        <span style={{ color }}>
          {icon} {Math.abs(value).toFixed(2)}%
        </span>
      );
    },
  },
  {
    title: '涨跌额',
    dataIndex: 'change',
    key: 'change',
    width: 100,
    sorter: true,
    render: (value: number) => {
      const color = value > 0 ? '#ff4d4f' : value < 0 ? '#52c41a' : '#999';
      return <span style={{ color }}>{value > 0 ? '+' : ''}{value.toFixed(2)}</span>;
    },
  },
  {
    title: '成交量',
    dataIndex: 'volume',
    key: 'volume',
    width: 120,
    sorter: true,
    render: (value: number) => `${(value / 10000).toFixed(2)}万`,
  },
  {
    title: '成交额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    sorter: true,
    render: (value: number) => `${(value / 100000000).toFixed(2)}亿`,
  },
  {
    title: '最高',
    dataIndex: 'high',
    key: 'high',
    width: 100,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '最低',
    dataIndex: 'low',
    key: 'low',
    width: 100,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '开盘',
    dataIndex: 'open',
    key: 'open',
    width: 100,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '昨收',
    dataIndex: 'close',
    key: 'close',
    width: 100,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '换手率',
    dataIndex: 'turnover',
    key: 'turnover',
    width: 100,
    sorter: true,
    render: (value: number) => `${value.toFixed(2)}%`,
  },
  {
    title: '市盈率',
    dataIndex: 'pe',
    key: 'pe',
    width: 100,
    sorter: true,
    render: (value: number) => value.toFixed(2),
  },
  {
    title: '总市值',
    dataIndex: 'marketCap',
    key: 'marketCap',
    width: 120,
    sorter: true,
    render: (value: number) => `${value.toFixed(2)}亿`,
  },
  {
    title: '行业',
    dataIndex: 'industry',
    key: 'industry',
    width: 100,
    render: (value: string) => <Tag color="blue">{value}</Tag>,
  },
];

const FundColumns: ColumnsType<FundData> = [
  {
    title: '代码',
    dataIndex: 'code',
    key: 'code',
    width: 100,
    fixed: 'left',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 180,
    fixed: 'left',
  },
  {
    title: '单位净值',
    dataIndex: 'netValue',
    key: 'netValue',
    width: 120,
    sorter: true,
    render: (value: number) => value.toFixed(4),
  },
  {
    title: '累计净值',
    dataIndex: 'accumulatedValue',
    key: 'accumulatedValue',
    width: 120,
    sorter: true,
    render: (value: number) => value.toFixed(4),
  },
  {
    title: '涨跌幅',
    dataIndex: 'changePercent',
    key: 'changePercent',
    width: 120,
    sorter: true,
    render: (value: number) => {
      const color = value > 0 ? '#ff4d4f' : value < 0 ? '#52c41a' : '#999';
      const icon = value > 0 ? <ArrowUpOutlined /> : value < 0 ? <ArrowDownOutlined /> : null;
      return (
        <span style={{ color }}>
          {icon} {Math.abs(value).toFixed(2)}%
        </span>
      );
    },
  },
  {
    title: '涨跌额',
    dataIndex: 'change',
    key: 'change',
    width: 100,
    sorter: true,
    render: (value: number) => {
      const color = value > 0 ? '#ff4d4f' : value < 0 ? '#52c41a' : '#999';
      return <span style={{ color }}>{value > 0 ? '+' : ''}{value.toFixed(4)}</span>;
    },
  },
  {
    title: '基金规模',
    dataIndex: 'scale',
    key: 'scale',
    width: 120,
    sorter: true,
    render: (value: number) => `${value.toFixed(2)}亿`,
  },
  {
    title: '基金经理',
    dataIndex: 'manager',
    key: 'manager',
    width: 100,
  },
  {
    title: '基金类型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    render: (value: string) => {
      const colorMap: Record<string, string> = {
        '股票型': 'red',
        '混合型': 'orange',
        '债券型': 'green',
        '指数型': 'blue',
        '货币型': 'cyan'
      };
      return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
    },
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 100,
    render: (value: string) => {
      const colorMap: Record<string, string> = {
        '高风险': 'red',
        '中高风险': 'orange',
        '中等风险': 'gold',
        '中低风险': 'blue',
        '低风险': 'green'
      };
      return <Tag color={colorMap[value] || 'default'}>{value}</Tag>;
    },
  },
  {
    title: '成立日期',
    dataIndex: 'establishDate',
    key: 'establishDate',
    width: 120,
  },
];

const StatsCard: React.FC<{ stats: StatsData; type: DataType }> = ({ stats, type }) => {
  const title = type === 'stock' ? '股票' : '基金';

  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <Card>
          <Statistic
            title={`${title}数量`}
            value={stats.totalCount}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title={`平均涨跌幅`}
            value={stats.avgChange}
            precision={2}
            valueStyle={{ color: stats.avgChange > 0 ? '#ff4d4f' : stats.avgChange < 0 ? '#52c41a' : '#999' }}
            suffix="%"
            prefix={stats.avgChange > 0 ? <ArrowUpOutlined /> : stats.avgChange < 0 ? <ArrowDownOutlined /> : null}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="上涨"
            value={stats.positiveCount}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="下跌"
            value={stats.negativeCount}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

const DataTable: React.FC<DataTableProps> = ({
  loading,
  dataType,
  data,
  pagination,
  stats,
  onTableChange
}) => {
  const columns = dataType === 'stock' ? StockColumns : FundColumns as any;

  return (
    <div>
      {stats && <StatsCard stats={stats} type={dataType} />}

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        scroll={{ x: dataType === 'stock' ? 1600 : 1200 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default DataTable;