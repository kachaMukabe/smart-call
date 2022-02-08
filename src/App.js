import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import Home from './components/Home';
import Join from './components/Join';
import Login from './components/Login';
import AllMeetingData from './components/AllMeetingData';
import RequireAuth from './utils/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={
            <RequireAuth>
              <Home />
            </RequireAuth>
            }
          />
          <Route path="/join/:id" exact element={
            <RequireAuth>
              <Join />
            </RequireAuth>
            }
          />
          <Route path="/data" exact element={
            <RequireAuth>
              <AllMeetingData />
            </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <div className="App">
      </div>
    </AuthProvider>
  );
}

export default App;
