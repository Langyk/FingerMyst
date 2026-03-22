from fastapi import FastAPI
from app.api import bonds, indices, dividend, etf, stocks

app = FastAPI(
    title="FingerMyst Server",
    description="金融数据查询接口，包含债券、指数、红利指数、ETF、证券资料等数据类型",
    version="1.0.0"
)

# 注册路由
app.include_router(bonds.router, prefix="/api/bonds", tags=["债券数据"])
app.include_router(indices.router, prefix="/api/indices", tags=["指数数据"])
app.include_router(dividend.router, prefix="/api/dividend", tags=["红利指数"])
app.include_router(etf.router, prefix="/api/etf", tags=["ETF数据"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["证券资料"])

@app.get("/")
def root():
    return {"message": "FingerMyst Server", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}