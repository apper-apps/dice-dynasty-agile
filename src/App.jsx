import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import GamePage from '@/components/pages/GamePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GamePage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'linear-gradient(135deg, #1E293B, #334155)',
            color: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }}
          progressStyle={{
            background: 'linear-gradient(90deg, #6366F1, #EC4899, #F59E0B)',
          }}
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;