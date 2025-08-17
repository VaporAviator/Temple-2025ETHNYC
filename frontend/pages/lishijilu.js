import { useRouter } from 'next/router'

export default function LiShiJiLu() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  // 模拟历史记录数据
  const historyRecords = [
    {
      id: 1,
      type: '算卦',
      question: '我下个月的运势能好转吗？',
      date: '三天前'
    },
    {
      id: 2,
      type: '算卦',
      question: '我下个月的爱情会来吗？',
      date: '一个月前'
    },
    {
      id: 3,
      type: '上香',
      question: '我要一直小猫',
      date: '一个月前'
    }
  ]

  const handleRecordClick = (record) => {
    if (record.type === '算卦') {
      // 跳转到算卦结果页面
      router.push({
        pathname: '/suangua3',
        query: { 
          question: record.question,
          numbers: '12,34,56',
          fromHistory: true
        }
      })
    } else if (record.type === '上香') {
      // 跳转到上香完成页面
      router.push({
        pathname: '/shangxiang4',
        query: { 
          wish: record.question,
          coin: 'SOL',
          amount: '1 SOL',
          status: 'success',
          fromHistory: true
        }
      })
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>
          返回主页
        </button>
        <div className="page-title">历史记录</div>
        <div></div>
      </div>

      <div style={{ paddingTop: '20px' }}>
        {historyRecords.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              📿
            </div>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              暂无历史记录
            </div>
            <div style={{ fontSize: '14px' }}>
              开始您的第一次算卦或上香吧
            </div>
          </div>
        ) : (
          historyRecords.map((record) => (
            <div 
              key={record.id}
              className="history-item"
              onClick={() => handleRecordClick(record)}
              style={{ cursor: 'pointer' }}
            >
              <div className="history-icon">
                {record.type}
              </div>
              <div className="history-content">
                <div className="history-question">
                  {record.question}
                </div>
                <div className="history-time">
                  {record.date}
                </div>
              </div>
              <div style={{
                fontSize: '18px',
                color: '#ccc'
              }}>
                →
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部提示 */}
      {historyRecords.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          color: '#999',
          fontSize: '14px',
          borderTop: '1px solid #eee',
          marginTop: '30px'
        }}>
          <div style={{ marginBottom: '10px' }}>🙏 感谢您对神明的虔诚</div>
          <div>点击记录可重新查看详细内容</div>
        </div>
      )}
    </div>
  )
}