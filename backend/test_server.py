#!/usr/bin/env python3
"""
简化的测试服务器，用于测试前后端连接
"""

import os
import asyncio
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator

app = FastAPI(
    title="小六壬占卜 API (测试版)",
    description="基于 DeepSeek API 的小六壬占卜服务 - 测试版本",
    version="1.0.0-test"
)

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DivinationRequest(BaseModel):
    """占卜请求模型"""
    wish: str
    numbers: List[int]
    
    @validator('wish')
    def validate_wish(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('愿望内容不能为空且至少包含2个字符')
        if len(v) > 200:
            raise ValueError('愿望内容不能超过200个字符')
        return v.strip()
    
    @validator('numbers')
    def validate_numbers(cls, v):
        if len(v) != 3:
            raise ValueError('必须提供恰好3个数字')
        for num in v:
            if not isinstance(num, int) or num < 1 or num > 99:
                raise ValueError('数字必须是1-99之间的整数')
        return v


class DivinationResponse(BaseModel):
    """占卜响应模型"""
    success: bool
    divination: Optional[str] = None
    prediction: Optional[str] = None
    advice: Optional[str] = None
    luck: Optional[int] = None
    full_text: Optional[str] = None
    error: Optional[str] = None


class IncenseRequest(BaseModel):
    """上香请求模型"""
    wish: str
    incense_type: str
    
    @validator('wish')
    def validate_wish(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('愿望内容不能为空且至少包含2个字符')
        if len(v) > 200:
            raise ValueError('愿望内容不能超过200个字符')
        return v.strip()
    
    @validator('incense_type')
    def validate_incense_type(cls, v):
        if v not in ['basic', 'premium', 'luxury']:
            raise ValueError('香的类型必须是 basic, premium, luxury 之一')
        return v


class IncenseResponse(BaseModel):
    """上香响应模型"""
    success: bool
    blessing: Optional[str] = None
    merit_points: Optional[int] = None
    incense_count: Optional[int] = None
    error: Optional[str] = None


class ShopItem(BaseModel):
    """商品模型"""
    id: int
    name: str
    description: str
    price: int
    category: str
    in_stock: bool
    image_url: Optional[str] = None


class ShopResponse(BaseModel):
    """商城响应模型"""
    success: bool
    items: Optional[List[ShopItem]] = None
    error: Optional[str] = None


class PurchaseRequest(BaseModel):
    """购买请求模型"""
    item_id: int
    quantity: int = 1
    
    @validator('quantity')
    def validate_quantity(cls, v):
        if v < 1 or v > 10:
            raise ValueError('购买数量必须在1-10之间')
        return v


class PurchaseResponse(BaseModel):
    """购买响应模型"""
    success: bool
    message: Optional[str] = None
    remaining_points: Optional[int] = None
    error: Optional[str] = None


# 模拟用户数据存储
user_data = {
    "incense_count": 0,
    "merit_points": 100,
}

# 商品数据
shop_items = [
    ShopItem(id=1, name="平安符", description="保佑平安健康", price=50, category="护身符", in_stock=True),
    ShopItem(id=2, name="招财符", description="招财进宝", price=80, category="护身符", in_stock=True),
    ShopItem(id=3, name="学业符", description="学业进步", price=60, category="护身符", in_stock=True),
    ShopItem(id=4, name="姻缘符", description="促进姻缘", price=70, category="护身符", in_stock=True),
    ShopItem(id=5, name="檀香", description="高品质檀香", price=30, category="香品", in_stock=True),
    ShopItem(id=6, name="沉香", description="珍贵沉香", price=100, category="香品", in_stock=True),
]


@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "小六壬占卜 API 服务 (测试版)",
        "version": "1.0.0-test",
        "endpoints": {
            "占卜": "/api/divination",
            "每日运势": "/api/daily-fortune",
            "上香": "/api/incense",
            "商城": "/api/shop",
            "购买": "/api/purchase",
            "API文档": "/docs"
        }
    }


@app.post("/api/divination", response_model=DivinationResponse)
async def perform_divination(request: DivinationRequest):
    """执行小六壬占卜 - 测试版本"""
    try:
        # 简化的占卜逻辑，用于测试
        numbers_sum = sum(request.numbers)
        remainder = numbers_sum % 6
        
        hexagrams = [
            {"name": "大安", "meaning": "事事如意，心想事成", "luck": 9},
            {"name": "留连", "meaning": "需要耐心等待，时机未到", "luck": 6},
            {"name": "速喜", "meaning": "好事将至，喜事临门", "luck": 8},
            {"name": "赤口", "meaning": "需要谨慎言行，避免冲突", "luck": 4},
            {"name": "小吉", "meaning": "小有收获，稳中求进", "luck": 7},
            {"name": "空亡", "meaning": "暂时困顿，需要调整方向", "luck": 3}
        ]
        
        hexagram = hexagrams[remainder]
        
        divination_text = f"根据您的三个数字，得出「{hexagram['name']}」卦象"
        prediction_text = f"您的愿望「{request.wish}」在此卦象下，{hexagram['meaning']}"
        
        if hexagram['luck'] >= 8:
            advice_text = "神明指引：时机成熟，可以积极行动，多行善事积累福德"
        elif hexagram['luck'] >= 6:
            advice_text = "神明指引：需要耐心等待，保持善念，适时而动"
        else:
            advice_text = "神明指引：当前需要谨慎，多烧香祈福，等待时机转变"
        
        full_text = f"【卦象解析】\n{divination_text}\n\n【运势预测】\n{prediction_text}\n\n【神明指引】\n{advice_text}\n\n【吉凶判断】\n运势评分：{hexagram['luck']}/10"
        
        return DivinationResponse(
            success=True,
            divination=divination_text,
            prediction=prediction_text,
            advice=advice_text,
            luck=hexagram['luck'],
            full_text=full_text
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"占卜服务异常: {str(e)}")


@app.post("/api/incense", response_model=IncenseResponse)
async def offer_incense(request: IncenseRequest):
    """上香祈福"""
    try:
        merit_rewards = {"basic": 10, "premium": 20, "luxury": 30}
        merit_points = merit_rewards[request.incense_type]
        
        user_data["incense_count"] += 1
        user_data["merit_points"] += merit_points
        
        blessings = [
            f"愿您的心愿「{request.wish}」早日实现，诸事顺遂！",
            f"香火缭绕，诚心祈愿「{request.wish}」，愿得佛祖庇佑！",
            f"虔诚上香，祈求「{request.wish}」心想事成，福慧双增！",
            f"香烟袅袅，愿「{request.wish}」如愿以偿，功德无量！"
        ]
        
        blessing = blessings[user_data["incense_count"] % len(blessings)]
        
        return IncenseResponse(
            success=True,
            blessing=blessing,
            merit_points=merit_points,
            incense_count=user_data["incense_count"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"上香服务异常: {str(e)}")


@app.get("/api/shop", response_model=ShopResponse)
async def get_shop_items(category: Optional[str] = None):
    """获取商城商品列表"""
    try:
        items = shop_items
        if category:
            items = [item for item in shop_items if item.category == category]
        
        return ShopResponse(success=True, items=items)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"商城服务异常: {str(e)}")


@app.post("/api/purchase", response_model=PurchaseResponse)
async def purchase_item(request: PurchaseRequest):
    """购买商品"""
    try:
        item = next((item for item in shop_items if item.id == request.item_id), None)
        if not item:
            raise HTTPException(status_code=404, detail="商品不存在")
        
        if not item.in_stock:
            raise HTTPException(status_code=400, detail="商品已售罄")
        
        total_price = item.price * request.quantity
        
        if user_data["merit_points"] < total_price:
            raise HTTPException(status_code=400, detail="功德值不足")
        
        user_data["merit_points"] -= total_price
        
        return PurchaseResponse(
            success=True,
            message=f"成功购买 {request.quantity} 个 {item.name}",
            remaining_points=user_data["merit_points"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"购买服务异常: {str(e)}")


@app.get("/api/user/status")
async def get_user_status():
    """获取用户状态"""
    return {
        "success": True,
        "incense_count": user_data["incense_count"],
        "merit_points": user_data["merit_points"]
    }


@app.get("/api/daily-fortune")
async def get_daily_fortune():
    """获取每日运势 - 简化版本"""
    today = datetime.now().strftime('%Y年%m月%d日')
    fortune_text = f"""黄道吉日
{today}
农历吉日 吉
宜 祈福上香 拜访长辈 整理房间
忌 冲动购物 与人争执 过度饮食

财运★★★★☆
财运平稳，有小额收入机会，宜谨慎理财。

事业★★★★☆
工作运势良好，适合推进重要项目。

感情★★★★☆
感情运势平稳，单身者宜多参加社交活动。

健康★★★★★
身体状况良好，注意作息规律。

今日建议
多行善事，保持善念，诚心祈福，福运自然来临。

今日幸运
幸运颜色: 金色
幸运数字: 8, 18, 28
幸运方位: 东南
吉时: 09:00-11:00"""

    return {
        "success": True,
        "fortune": fortune_text,
        "date": today,
        "lunar_date": "农历吉日"
    }


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "test"
    }


if __name__ == "__main__":
    import uvicorn
    host = "127.0.0.1"
    port = 8000
    
    print(f"🔮 小六壬占卜服务启动中 (测试版)...")
    print(f"📍 服务地址: http://{host}:{port}")
    print(f"📚 API 文档: http://{host}:{port}/docs")
    print("💡 按 Ctrl+C 停止服务")
    print()
    
    uvicorn.run(
        "test_server:app",
        host=host,
        port=port,
        reload=True
    )