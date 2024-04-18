import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {
      window.yaContextCb.push(()=>{
        Ya.Context.AdvManager.render({
          "blockId": "R-A-7631070-1",
          "type": "floorAd",
          "platform": "touch"
        })
      })
    }
  </React.StrictMode>,
)
