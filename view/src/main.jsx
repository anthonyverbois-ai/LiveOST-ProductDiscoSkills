import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {App} from './App.jsx';

// The view is light-only, whatever the viewer's theme: a classic, light reading surface.
createRoot(document.getElementById('root')).render(
  <Theme theme={neutralTheme} mode="light">
    <App />
  </Theme>,
);
