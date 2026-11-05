// Larger fictional tree, used to check how the view holds up with 10 branches across 4 features.
// Build it with: LPD_DATA=large node build.mjs (writes dist/live-view-large.html).
// Opportunities and solutions that also exist in the Notion demo keep their links; the others have none.
import * as base from './data.js';

const keep = Object.fromEntries(base.opportunities.map((o) => [o.id, o]));

export const meta = {
  ...base.meta,
  squad: 'Demo squad, large test',
  recap: {
    analysed: '5 calls and 14 tickets',
    lines: [
      '21 pieces of evidence attached (17 to existing opportunities, 4 pending)',
      'Trending: “I lose time reformatting my exports” (+4 evidence, moved up from 4 to 3)',
      'New: “My manager can’t open the report on mobile” (Sharing)',
      'To decide: new opportunity “I’m not sure my numbers are up to date”',
      'Out of scope: 3 verbatims about other squads’ areas',
    ],
  },
};

export const opportunities = [
  // Report builder
  {...keep.start, rank: 1, children: ['rebuild', 'chart-type']},
  {...keep.rebuild, rank: 4},
  {id: 'chart-type', parent: 'start', name: 'I don’t know which chart fits my data', status: 'active', rank: 9, area: 'Report builder', evidence: 7, accounts: 5, lastEvidence: '2026-11-03'},
  {id: 'clicks', name: 'Building a report takes too many clicks', status: 'active', rank: 6, area: 'Report builder', evidence: 10, accounts: 6, lastEvidence: '2026-11-04'},
  {id: 'reuse', name: 'I can’t reuse a section from another report', status: 'active', rank: 12, area: 'Report builder', evidence: 6, accounts: 4, lastEvidence: '2026-10-29'},

  // Templates
  {...keep.template, parent: undefined, rank: 2, children: ['brand']},
  {id: 'brand', parent: 'template', name: 'Templates don’t match our brand', status: 'active', rank: 8, area: 'Templates', evidence: 8, accounts: 5, lastEvidence: '2026-11-02'},
  {id: 'formulas', name: 'I don’t trust templates to have the right formulas', status: 'active', rank: 11, area: 'Templates', evidence: 5, accounts: 3, lastEvidence: '2026-10-27'},

  // Exports
  {...keep.exports, area: 'Exports', rank: 3, movedFrom: '4', children: ['page-breaks', 'charts']},
  {...keep.charts, area: 'Exports'},
  {id: 'page-breaks', parent: 'exports', name: 'Page breaks are wrong in the PDF', status: 'active', rank: 7, area: 'Exports', evidence: 9, accounts: 6, lastEvidence: '2026-11-05'},
  {id: 'formats', name: 'I export the same report to several formats', status: 'active', rank: 10, area: 'Exports', evidence: 7, accounts: 4, lastEvidence: '2026-11-01'},

  // Sharing
  {id: 'seen', name: 'I don’t know who has seen my report', status: 'active', rank: 5, area: 'Sharing', evidence: 11, accounts: 7, lastEvidence: '2026-11-04', children: ['comment']},
  {id: 'comment', parent: 'seen', name: 'I can’t comment on a shared report', status: 'active', rank: 13, area: 'Sharing', evidence: 4, accounts: 3, lastEvidence: '2026-10-30'},
  {id: 'mobile', name: 'My manager can’t open the report on mobile', status: 'active', rank: 14, area: 'Sharing', evidence: 5, accounts: 2, lastEvidence: '2026-11-05', isNewToday: true},
  {id: 'dead-links', name: 'Shared links stop working when someone leaves', status: 'active', rank: 15, area: 'Sharing', evidence: 3, accounts: 2, lastEvidence: '2026-10-21'},

  // Below the tree
  {...keep.freshness},
  {...keep.external, area: 'Sharing'},
];

export const solutions = [
  ...base.solutions,
  {opp: 'clicks', name: 'Keyboard shortcuts for common blocks', status: 'idea'},
  {opp: 'brand', name: 'Apply the company theme to every template', status: 'to test', assumption: 'Most accounts have one company theme', assumptionResult: 'untested'},
  {opp: 'page-breaks', name: 'Page break preview before export', status: 'idea'},
  {opp: 'seen', name: 'Viewers list on each report', status: 'testing', assumption: 'Authors want names, not just a count', assumptionResult: 'unclear'},
];

export const {evidence, pending, changelog} = base;
