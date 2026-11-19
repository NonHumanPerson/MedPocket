import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm('A new MedPocket version is available. Refresh to load the real model download fix?')) {
      window.location.reload();
    }
  },
});

createRoot(document.getElementById('root')!).render(<App />);
