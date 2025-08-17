import { useState } from 'react'
import { useRouter } from 'next/router'

export default function ShangCheng3() {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    email: '',
    address: '',
    phone: ''
  })

  const handleBack = () => {
    router.back()
  }

  const handleNext = () => {
    router.push('/shangcheng4')
  }

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

      {/* Product Info Card */}
      <div style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '12px',
        gap: '20px',
        position: 'absolute',
        width: '363px',
        height: '166px',
        left: '15px',
        top: '106px',
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(15px)'
      }}>
        {/* Product Image */}
        <div style={{
          width: '122px',
          height: '122px',
          backgroundImage: 'url("/Screenshot 2025-08-08 at 15.25.49.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          flex: 'none'
        }}></div>

        {/* Product Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '46px',
          width: '183px',
          height: '142px',
          flex: 'none'
        }}>
          {/* Product Info */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '12px',
            width: '183px',
            height: '76px'
          }}>
            {/* Product Title */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0px',
              gap: '6px',
              width: '164px',
              height: '17px'
            }}>
              <span style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '17px',
                color: 'rgba(0, 0, 0, 0.8)'
              }}>
                108卷心经本
              </span>
              <div style={{
                width: '12px',
                height: '0px',
                border: '1px solid rgba(0, 0, 0, 0.8)',
                transform: 'rotate(90deg)'
              }}></div>
              <span style={{
                fontWeight: '600',
                fontSize: '12px',
                lineHeight: '17px',
                color: 'rgba(0, 0, 0, 0.8)'
              }}>
                手抄佛经大悲咒
              </span>
            </div>

            {/* Description */}
            <div style={{
              width: '183px',
              height: '47px',
              fontWeight: '600',
              fontSize: '8px',
              lineHeight: '12px',
              color: 'rgba(0, 0, 0, 0.6)'
            }}>
              功能文字介绍。功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍功能文字介绍。需要介绍这是实体+NFT。
            </div>
          </div>

          {/* Price and Quantity */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0px',
            gap: '73px',
            width: '183px',
            height: '20px'
          }}>
            {/* Price */}
            <div style={{
              fontWeight: '700',
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#000000'
            }}>
              120U
            </div>

            {/* Quantity Controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '1px',
              width: '53px',
              height: '14px'
            }}>
              {/* Minus Button */}
              <button
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px 4px',
                  width: '14px',
                  height: '14px',
                  background: 'rgba(249, 244, 226, 0.5)',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => handleQuantityChange(-1)}
              >
                <div style={{
                  width: '6px',
                  height: '1px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  margin: '6.5px 0'
                }}></div>
              </button>

              {/* Quantity Display */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2px',
                width: '23px',
                height: '14px',
                background: 'rgba(249, 244, 226, 0.7)',
                borderRadius: '2px'
              }}>
                <span style={{
                  fontWeight: '600',
                  fontSize: '10px',
                  lineHeight: '14px',
                  textAlign: 'center',
                  color: 'rgba(0, 0, 0, 0.8)'
                }}>
                  {quantity}
                </span>
              </div>

              {/* Plus Button */}
              <button
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px 4px',
                  width: '14px',
                  height: '14px',
                  background: 'rgba(249, 244, 226, 0.7)',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => handleQuantityChange(1)}
              >
                <div style={{
                  position: 'absolute',
                  width: '6px',
                  height: '1px',
                  background: '#000000',
                  top: '6.5px'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '1px',
                  height: '6px',
                  background: '#000000',
                  left: '6.5px'
                }}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        gap: '66px',
        position: 'absolute',
        width: '363px',
        height: '462.4px',
        left: '15px',
        top: '293px',
        background: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(15px)'
      }}>
        {/* Form Fields */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '36px',
          width: '283px',
          height: '284px'
        }}>
          {/* Name Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '54px',
            width: '283px',
            height: '28px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              姓名
            </span>
            <input
              style={{
                boxSizing: 'border-box',
                width: '195px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(15px)',
                padding: '12px 16px',
                fontSize: '12px',
                borderRadius: '0'
              }}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Nationality Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '54px',
            width: '283px',
            height: '28px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              国籍
            </span>
            <div style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '12px',
              gap: '10px',
              width: '195px',
              height: '28px',
              background: 'rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(15px)',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: '13.72%',
                  right: '13.74%',
                  top: '32.42%',
                  bottom: '29.37%',
                  background: '#3F4442',
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                }}></div>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '26px',
            width: '283px',
            height: '28px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              电子邮件
            </span>
            <input
              type="email"
              style={{
                boxSizing: 'border-box',
                width: '195px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(15px)',
                padding: '12px 16px',
                fontSize: '12px',
                borderRadius: '0'
              }}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          {/* Address Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '54px',
            width: '283px',
            height: '28px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              地址
            </span>
            <input
              style={{
                boxSizing: 'border-box',
                width: '195px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(15px)',
                padding: '12px 16px',
                fontSize: '12px',
                borderRadius: '0'
              }}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          {/* Phone Field */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '54px',
            width: '283px',
            height: '28px'
          }}>
            <span style={{
              fontWeight: '600',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#000000'
            }}>
              电话
            </span>
            <input
              type="tel"
              style={{
                boxSizing: 'border-box',
                width: '195px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(15px)',
                padding: '12px 16px',
                fontSize: '12px',
                borderRadius: '0'
              }}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '7.68px 33.12px',
            gap: '4.8px',
            width: '149.4px',
            height: '32.4px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13.44px',
            lineHeight: '19px',
            textAlign: 'center',
            color: '#F9F4E2'
          }}
          onClick={handleNext}
        >
          下一步
        </button>
      </div>
    </div>
  )
}