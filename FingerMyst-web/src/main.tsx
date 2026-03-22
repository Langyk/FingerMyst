import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'

const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#7c3aed',
    colorBgContainer: '#1e1e2f',
    colorBgElevated: '#27273a',
    colorBorder: '#3d3d5c',
    colorText: '#e9d5ff',
    colorTextSecondary: '#a0a0b8',
    borderRadius: 8,
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={darkTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)