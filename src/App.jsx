import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './store/context/AuthContext';
// import { initDevAuth } from './utils/devAuth';

// Initialize development authentication (uses VITE_JWT_TOKEN from .env)
// initDevAuth();

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
