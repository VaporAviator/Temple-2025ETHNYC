import { useState, useEffect } from 'react'
import apiClient from '../lib/api'

export default function TestConnection() {
  const [status, setStatus] = useState('testing')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setStatus('testing')
    setError('')
    
    try {
      console.log('Testing API connection to:', apiClient.baseURL)
      const response = await apiClient.healthCheck()
      setResult(response)
      setStatus('success')
      console.log('API connection successful:', response)
    } catch (err) {
      console.error('API connection failed:', err)
      setError(err.message)
      setStatus('failed')
    }
  }

  const testDivination = async () => {
    setStatus('testing-divination')
    setError('')
    
    try {
      const response = await apiClient.divination('测试连接', [1, 2, 3])
      setResult(response)
      setStatus('divination-success')
      console.log('Divination test successful:', response)
    } catch (err) {
      console.error('Divination test failed:', err)
      setError(err.message)
      setStatus('divination-failed')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div></div>
        <div className="page-title">连接测试</div>
        <div></div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <strong>API地址:</strong> {apiClient.baseURL}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <strong>连接状态:</strong> 
          <span style={{ 
            color: status === 'success' || status === 'divination-success' ? 'green' : 
                   status === 'failed' || status === 'divination-failed' ? 'red' : 'orange',
            marginLeft: '10px'
          }}>
            {status === 'testing' ? '正在测试...' :
             status === 'success' ? '✅ 连接成功' :
             status === 'failed' ? '❌ 连接失败' :
             status === 'testing-divination' ? '正在测试占卜...' :
             status === 'divination-success' ? '✅ 占卜测试成功' :
             status === 'divination-failed' ? '❌ 占卜测试失败' : '未知状态'}
          </span>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: 'red', 
            padding: '10px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <strong>错误:</strong> {error}
          </div>
        )}

        {result && (
          <div style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <strong>响应数据:</strong>
            <pre style={{ 
              fontSize: '12px', 
              overflow: 'auto',
              marginTop: '10px',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <button 
            className="next-btn" 
            onClick={testConnection}
            style={{ backgroundColor: '#007bff' }}
          >
            重新测试连接
          </button>
          
          <button 
            className="next-btn" 
            onClick={testDivination}
            style={{ backgroundColor: '#28a745' }}
          >
            测试占卜功能
          </button>
          
          <button 
            className="next-btn" 
            onClick={() => window.location.href = '/'}
            style={{ backgroundColor: '#6c757d' }}
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  )
}