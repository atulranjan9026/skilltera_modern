import { GoogleOAuthProvider } from '@react-oauth/google';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './store/context/AuthContext';
import { Toaster } from 'sonner';
// import { initDevAuth } from './utils/devAuth';

// Initialize development authentication (uses VITE_JWT_TOKEN from .env)
// initDevAuth();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
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
        </GoogleOAuthProvider>
    );
}

export default App
