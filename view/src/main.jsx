import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {App} from './App.jsx';
import {loadData, meta} from './data.js';

// The view is light-only, whatever the viewer's theme: a classic, light reading surface.
// The tree's data is loaded first: the page shows the squad's tree, or the demo when there is no data file.
loadData().then(() => {
  if (meta.squad) document.title = `Opportunity Solution Tree · ${meta.squad}`;
  createRoot(document.getElementById('root')).render(
    <Theme theme={neutralTheme} mode="light">
      <App />
    </Theme>,
  );
});
