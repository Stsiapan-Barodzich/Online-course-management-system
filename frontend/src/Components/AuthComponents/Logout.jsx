import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@Contexts/AuthContext';
import {useAuthFetch} from '@Hooks/useAuthFetch';

const Logout = () => {
  const { setAuthTokens, setIsAuthenticated } = useContext(useAuth);
  const navigate = useNavigate();
  const { fetch } = useAuthFetch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          
          await fetch('/logout/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthTokens(null);
        setIsAuthenticated(false);
        
        navigate('/login');
      } catch (error) {
        console.error('Logout failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthTokens(null);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    performLogout();
  }, [fetch, navigate, setAuthTokens, setIsAuthenticated]);

  return null; 
};

export default Logout;
