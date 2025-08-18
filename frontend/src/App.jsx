import { BrowserRouter} from 'react-router-dom';
import { AuthProvider } from '@Contexts/AuthContext.jsx';
import AppRoutes from './Routes/AppRoutes.jsx';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
