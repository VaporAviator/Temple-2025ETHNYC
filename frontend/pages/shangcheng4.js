import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ShangCheng4() {
  const router = useRouter()
  const { productId, quantity, name, price, total, payment, address } = router.query
  const [orderStatus, setOrderStatus] = useState('processing') // processing, success, failed
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    // 生成订单号
    const newOrderId = 'TC' + Date.now().toString().slice(-8)
    setOrderId(newOrderId)
    
    // 模拟订单处理
    const timer = setTimeout(() => {
      setOrderStatus('success')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleBackHome = () => {
    router.push('/')
  }

  const handleContinueShopping = () => {
    router.push('/shangcheng1')
  }

  const handleViewOrder = () => {
    alert('查看订单详情功能开发中...')
  }

  if (orderStatus === 'processing') {
    return (
      <div className="page-container">
        <div className="page-header">
          <div></div>
          <div className="page-title">订单处理中</div>
          <div></div>
        </div>

        <div className="input-section" style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '50px auto 30px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
            正在处理您的订单
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            订单号: {orderId}
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            请稍候，不要关闭页面...
          </div>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div></div>
        <div className="page-title">订单完成</div>
        <div></div>
      </div>

      <div className="input-section" style={{ textAlign: 'center' }}>
        <div style={{ 
          marginBottom: '40px'
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            margin: '0 auto 20px', 
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #28a745, #90ee90)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            ✅
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            订单提交成功！
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            订单号: {orderId}
          </div>
        </div>

        {/* 订单详情 */}
        <div style={{ 
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h4 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>
            订单详情
          </h4>
          <div style={{ marginBottom: '10px' }}>
            <strong>商品：</strong>{name}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>数量：</strong>{quantity} 件
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>支付方式：</strong>{payment}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>支付金额：</strong>{total}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
            <strong>收货地址：</strong><br />
            {address}
          </div>
        </div>

        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px', 
          marginBottom: '30px',
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '8px' }}>📦 我们将尽快为您安排发货</p>
          <p style={{ marginBottom: '8px' }}>🚚 预计3-7个工作日送达</p>
          <p style={{ marginBottom: '8px' }}>📱 您可以通过订单号查询物流信息</p>
          <p>🙏 感谢您对神庙商城的信任</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            className="next-btn"
            onClick={handleViewOrder}
            style={{ backgroundColor: '#007bff' }}
          >
            查看订单详情
          </button>
          
          <button 
            className="next-btn"
            onClick={handleContinueShopping}
            style={{ backgroundColor: '#28a745' }}
          >
            继续购物
          </button>
          
          <button 
            className="cancel-btn"
            onClick={handleBackHome}
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  )
}