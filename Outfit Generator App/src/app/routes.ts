import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { UploadOutfits } from './pages/UploadOutfits';
import { MainApp } from './pages/MainApp';
import Shopping from './pages/Shopping';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/onboarding',
    Component: Onboarding,
  },
  {
    path: '/upload-outfits',
    Component: UploadOutfits,
  },
  {
    path: '/app',
    Component: MainApp,
  },
  {
    path: '/shopping',
    Component: Shopping,
  },
]);