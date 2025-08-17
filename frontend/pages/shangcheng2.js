import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ShangCheng2() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleBack = () => {
    router.back()
  }

  const handleBuyNow = () => {
    router.push('/shangcheng3')
  }

  const handleAddToCart = () => {
    alert('已添加到购物车')
  }

  return (
    <div style={{
      position: 'relative',
      width: '393px',
      height: '852px',
      background: 'linear-gradient(180deg, #F5F9FA 68.75%, #FFFFFF 100%)',
      margin: '0 auto',
      fontFamily: "'Source Han Serif CN', serif"
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        left: '8.4%',
        top: '4.34%',
        fontSize: '18px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        cursor: 'pointer',
        padding: '5px 10px',
        borderRadius: '4px'
      }} onClick={handleBack}>
        ←
      </div>
      
      <div style={{
        position: 'absolute',
        width: '48px',
        height: '18px',
        left: 'calc(50% - 48px/2 + 0.5px)',
        top: '36px',
        fontWeight: '400',
        fontSize: '24px',
        lineHeight: '18px',
        textAlign: 'center',
        color: '#000000'
      }}>
        商城
      </div>

      {/* AI Avatar */}
      <div style={{
        position: 'absolute',
        width: '47px',
        height: '48.01px',
        left: '327px',
        top: '21px'
      }}>
        <div style={{
          position: 'absolute',
          width: '47px',
          height: '48.01px',
          background: 'radial-gradient(55.46% 100.33% at 50.13% 100.33%, #E6E6E6 27.88%, #8ACFCB 100%)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          left: '87.02%',
          right: '8.4%',
          top: '4.46%',
          bottom: '93.43%',
          fontWeight: '400',
          fontSize: '16px',
          lineHeight: '18px',
          textAlign: 'center',
          color: '#3F4442'
        }}>
          AI
        </div>
      </div>

      {/* Product Image */}
      <div style={{
        boxSizing: 'border-box',
        position: 'absolute',
        width: '393px',
        height: '277px',
        left: '0px',
        top: '108px',
        backgroundImage: 'url("/Rectangle 240647815.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(0, 0, 0, 0.15)'
      }}>
        {/* Image indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2px 4px',
          gap: '4.8px',
          position: 'absolute',
          width: '26px',
          height: '15px',
          left: '352px',
          top: '249px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '4px'
        }}>
          <span style={{
            fontWeight: '600',
            fontSize: '10px',
            lineHeight: '14px',
            textAlign: 'center',
            color: 'rgba(249, 244, 226, 0.8)'
          }}>
            1/5
          </span>
        </div>
      </div>

      {/* Price */}
      <div style={{
        position: 'absolute',
        width: '97px',
        height: '34px',
        left: '22px',
        top: '408px',
        fontWeight: '700',
        fontSize: '24px',
        lineHeight: '34px',
        textAlign: 'left',
        color: '#EDC846'
      }}>
        120U
      </div>

      {/* Product Title */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '0px',
        gap: '8px',
        position: 'absolute',
        width: '244px',
        height: '26px',
        left: '23px',
        top: '461px'
      }}>
        <span style={{
          fontWeight: '600',
          fontSize: '18px',
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.8)'
        }}>
          108卷心经本
        </span>
        <div style={{
          width: '16px',
          height: '0px',
          border: '1px solid rgba(0, 0, 0, 0.8)',
          transform: 'rotate(90deg)'
        }}></div>
        <span style={{
          fontWeight: '600',
          fontSize: '18px',
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.8)'
        }}>
          手抄佛经大悲咒
        </span>
      </div>

      {/* Description */}
      <div style={{
        position: 'absolute',
        width: '349px',
        height: '51px',
        left: '22px',
        top: '506px',
        fontWeight: '600',
        fontSize: '12px',
        lineHeight: '17px',
        color: 'rgba(0, 0, 0, 0.6)'
      }}>
        功能文字介绍。功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍。需要介绍这是实体+NFT。
      </div>

      {/* Additional Info Box */}
      <div style={{
        boxSizing: 'border-box',
        position: 'absolute',
        width: '363px',
        height: '313px',
        left: '15px',
        top: '580px',
        background: '#D9D9D9',
        border: '0.4px solid #000000'
      }}>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0px',
        position: 'absolute',
        width: '206px',
        height: '32px',
        left: '152px',
        top: '783px'
      }}>
        <button
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7.68px 33.12px',
            gap: '4.8px',
            width: '103px',
            height: '32px',
            background: 'rgba(249, 244, 226, 0.7)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13.44px',
            lineHeight: '19px',
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={handleAddToCart}
        >
          加入购物车
        </button>
        <button
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7.68px 33.12px',
            gap: '4.8px',
            width: '103px',
            height: '32px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13.44px',
            lineHeight: '19px',
            textAlign: 'center',
            color: '#F9F4E2'
          }}
          onClick={handleBuyNow}
        >
          下一步
        </button>
      </div>
    </div>
  )
}