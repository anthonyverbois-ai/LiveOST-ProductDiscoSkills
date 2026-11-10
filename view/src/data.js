// The data of the view. A published page loads the tree's data from a file published next to it, data.json
// (see "Data file" in docs/live-view.md). Without that file, the view shows the fictional demo tree.
// These are live bindings: loadData() fills them before the first render.
import * as demo from './demo-data.js';

export let isDemo = true;
export let meta = demo.meta;
export let opportunities = demo.opportunities;
export let evidence = demo.evidence;
export let solutions = demo.solutions;
export let pending = demo.pending;
export let changelog = demo.changelog;

export async function loadData() {
  try {
    const response = await fetch('data.json', {cache: 'no-store'});
    if (!response.ok) return;
    const data = await response.json();
    if (!data || !Array.isArray(data.opportunities)) return;
    isDemo = false;
    meta = data.meta ?? {};
    opportunities = data.opportunities;
    evidence = data.evidence ?? [];
    solutions = data.solutions ?? [];
    pending = data.pending ?? [];
    changelog = data.changelog ?? [];
  } catch {
    // No data file (the demo, or the page opened from a folder): the demo tree stays.
  }
}
