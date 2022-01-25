import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router';
import AuthView from '../views/AuthView';
import Homepage from '../views/Homepage';
import Layout from '../views/Layout';
import ChatView from '../views/ChatView';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Homepage />} />
          <Route path="auth" element={<AuthView />} />
          <Route path="rooms/:roomKey" element={<ChatView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
