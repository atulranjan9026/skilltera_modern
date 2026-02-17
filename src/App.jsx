import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './store/context/AuthContext';
import { Toaster } from 'sonner';
// import { initDevAuth } from './utils/devAuth';

// Initialize development authentication (uses VITE_JWT_TOKEN from .env)
// initDevAuth();

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster 
                position="top-right"
                richColors
                expand={false}
                closeButton
                duration={4000}
            />
        </AuthProvider>
    )
}

export default App
