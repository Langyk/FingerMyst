# 证券信息 API 文档

Base URL: `/api/stocks`

---

## 1. 获取全部证券信息

### 接口

```
GET /api/stocks/all
```

### Query 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| force_refresh | boolean | 否 | 是否强制从API刷新数据，默认 `false` |

### 响应示例

```json
{
  "total": 100,
  "data": [
    {
      "code": "sh.600000",
      "code_name": "浦发银行",
      "sec_type": "1",
      "status": "1"
    }
  ]
}
```

### 证券对象字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 证券代码 |
| code_name | string | 证券名称 |
| sec_type | string | 证券类型 |
| status | string | 上市状态 |

---

## 2. 搜索证券

### 接口

```
GET /api/stocks/search
```

### Query 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 证券名称(模糊搜索) |
| code | string | 否 | 证券代码(模糊搜索) |
| sec_type | string | 否 | 证券类型 |
| status | string | 否 | 上市状态 |

### 证券类型 (sec_type)

| code | 说明 |
|------|------|
| 1 | 股票 |
| 2 | 指数 |
| 3 | 其它 |
| 4 | 可转债 |
| 5 | ETF |

### 上市状态 (status)

| code | 说明 |
|------|------|
| 1 | 上市 |
| 0 | 退市 |

### 响应示例

```json
{
  "total": 10,
  "data": [
    {
      "code": "sh.600000",
      "code_name": "浦发银行",
      "sec_type": "1",
      "status": "1"
    }
  ]
}
```

---

## 3. 刷新缓存

### 接口

```
POST /api/stocks/refresh-cache
```

### 响应示例

```json
{
  "success": true,
  "message": "缓存刷新成功",
  "count": 5000
}
```

---

## 4. 获取缓存状态

### 接口

```
GET /api/stocks/cache-status
```

### 响应示例

```json
{
  "count": 5000,
  "last_update": "2026-03-22 10:00:00"
}
```

---

## 5. 获取证券类型列表

### 接口

```
GET /api/stocks/types
```

### 响应示例

```json
[
  {"code": "1", "name": "股票"},
  {"code": "2", "name": "指数"},
  {"code": "3", "name": "其它"},
  {"code": "4", "name": "可转债"},
  {"code": "5", "name": "ETF"}
]
```

---

## 6. 获取上市状态列表

### 接口

```
GET /api/stocks/status-list
```

### 响应示例

```json
[
  {"code": "1", "name": "上市"},
  {"code": "0", "name": "退市"}
]
```

---

## 前端调用示例

### Axios

```javascript
// 获取全部证券
const securities = await axios.get('/api/stocks/all');

// 搜索证券
const results = await axios.get('/api/stocks/search', {
  params: {
    name: '银行',
    sec_type: '1',
    status: '1'
  }
});

// 强制刷新缓存
await axios.post('/api/stocks/refresh-cache');
```

### React Query

```javascript
// 获取全部证券
const { data } = useQuery(['securities'], () =>
  axios.get('/api/stocks/all').then(res => res.data)
);

// 搜索证券
const { data } = useQuery(['securities', searchParams], () =>
  axios.get('/api/stocks/search', { params: searchParams }).then(res => res.data)
);
```