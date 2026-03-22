import React from 'react';
import { Input, Button, Space, Radio } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { DataType } from '../../types';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  dataType: DataType;
  onDataTypeChange: (type: DataType) => void;
  showTypeSwitch?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onKeywordChange,
  onSearch,
  onReset,
  dataType,
  onDataTypeChange,
  showTypeSwitch = true
}) => {
  const handleSearch = () => {
    onSearch();
  };

  const handleReset = () => {
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {showTypeSwitch && (
        <Space wrap style={{ marginBottom: 16 }}>
          <Radio.Group
            value={dataType}
            onChange={(e) => onDataTypeChange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="stock">股票</Radio.Button>
            <Radio.Button value="fund">基金</Radio.Button>
          </Radio.Group>
        </Space>
      )}

      <Space wrap>
        <Input
          placeholder="请输入代码或名称搜索"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: 250 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          搜索
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          重置
        </Button>
      </Space>
    </div>
  );
};

export default SearchBar;