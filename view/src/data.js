// Fictional demo data, mirroring the demo tree used to test the Notion data model.
// In the live version, this module is replaced by a reader of the user's Notion databases.
// The notion links point to the demo pages created to test the data model: private, fictional content.

export const meta = {
  squad: 'Demo squad',
  northStar: 'Customers make better decisions with their data',
  outcome: 'Reduce the time to build a first report from 3 days to 1 day',
  outcomeSince: '2026-09-01',
  outcomeNotion: 'https://www.notion.so/40f5d4385f6f81e58152c865d4ad9561',
  lastRefresh: '2026-11-05T07:42:00',
  pluginVersion: '0.1.0',
  changelogUrl:
    'https://github.com/anthonyverbois-ai/LiveOST-ProductDiscoSkills/blob/main/CHANGELOG.md',
  sources: [
    {name: 'Calls', status: 'success', detail: 'OK at the last run'},
    {name: 'Tickets', status: 'success', detail: 'OK at the last run'},
    {name: 'Analytics', status: 'success', detail: 'OK at the last run (partial on Nov 4)'},
    {name: 'Docs and release notes', status: 'success', detail: 'OK at the last run'},
  ],
  recap: {
    analysed: '3 calls and 7 tickets',
    lines: [
      '12 pieces of evidence attached (9 to existing opportunities, 3 pending)',
      'Trending: “I lose time reformatting my exports” (+4 evidence, moved up from 3 to 2)',
      'To decide: new opportunity “I’m not sure my numbers are up to date”',
      'Out of scope: 2 verbatims about other squads’ areas',
    ],
  },
};

export const opportunities = [
  {
    id: 'start',
    notion: 'https://www.notion.so/40f5d4385f6f81fcb992dacdebac5bda',
    name: 'I don’t know where to start when building a report',
    status: 'active',
    rank: 1,
    area: 'Report builder',
    evidence: 23,
    accounts: 11,
    lastEvidence: '2026-11-04',
    children: ['template', 'rebuild'],
  },
  {
    id: 'template',
    notion: 'https://www.notion.so/40f5d4385f6f8130b9b9f40746faad0e',
    parent: 'start',
    name: 'I can’t find the right template for my use case',
    status: 'active',
    rank: 2,
    area: 'Templates',
    evidence: 14,
    accounts: 8,
    lastEvidence: '2026-11-04',
  },
  {
    id: 'rebuild',
    notion: 'https://www.notion.so/40f5d4385f6f81cb8bd9fbb18dcc482b',
    parent: 'start',
    name: 'I rebuild the same layout every month',
    status: 'active',
    rank: 4,
    area: 'Report builder',
    evidence: 9,
    accounts: 6,
    lastEvidence: '2026-11-05',
    isNewToday: true,
  },
  {
    id: 'exports',
    notion: 'https://www.notion.so/40f5d4385f6f813a8c08d598fd7826a2',
    name: 'I lose time reformatting my exports',
    status: 'active',
    rank: 3,
    movedFrom: '3',
    area: 'Report builder',
    evidence: 12,
    accounts: 7,
    lastEvidence: '2026-11-05',
    trend: 4,
    children: ['charts'],
  },
  {
    id: 'charts',
    notion: 'https://www.notion.so/40f5d4385f6f81e2ade5cbf49575dba2',
    parent: 'exports',
    name: 'Charts break when I paste them elsewhere',
    status: 'addressed',
    area: 'Report builder',
    evidence: 6,
    evidenceSinceRelease: 0,
    accounts: 4,
    lastEvidence: '2026-06-12',
  },
  {
    id: 'freshness',
    notion: 'https://www.notion.so/40f5d4385f6f81cd8e7ec19e4fe2d89a',
    name: 'I’m not sure my numbers are up to date',
    status: 'candidate',
    area: 'Report builder',
    evidence: 3,
    accounts: 2,
    lastEvidence: '2026-11-05',
  },
  {
    id: 'external',
    notion: 'https://www.notion.so/40f5d4385f6f81219b73ff80a9bad7b4',
    name: 'I need to share reports with people outside my company',
    status: 'parked',
    area: 'Report builder',
    evidence: 7,
    accounts: 5,
    lastEvidence: '2026-10-28',
  },
];

export const evidence = [
  {opp: 'exports', verbatim: 'Every week I export the report and spend an hour fixing fonts and column widths before I can send it.', source: 'Call', account: 'Account A', date: '2026-11-05', rationale: 'Manual rework after export, recurring every week.', confidence: 'high'},
  {opp: 'exports', verbatim: 'The PDF export ignores my page breaks, so I redo the layout by hand.', source: 'Ticket', account: 'Account B', date: '2026-11-05', rationale: 'Export output needs reformatting (rule learned on Nov 3).', confidence: 'high'},
  {opp: 'exports', verbatim: 'We copy everything into a spreadsheet first, otherwise the numbers lose their format.', source: 'Call', account: 'Account C', date: '2026-11-04', rationale: 'Workaround to keep formatting on export.', confidence: 'medium'},
  {opp: 'exports', verbatim: 'Exports never match our house style, my team fixes them before every meeting.', source: 'Ticket', account: 'Account D', date: '2026-11-03', rationale: 'Same rework, driven by a house style.', confidence: 'high'},
  {opp: 'start', verbatim: 'When I open the editor I just stare at a blank page, I don’t know which block to add first.', source: 'Call', account: 'Account E', date: '2026-11-04', rationale: 'No starting point when building a report.', confidence: 'high'},
  {opp: 'start', verbatim: 'It took our new analyst three days to produce a first report she was happy with.', source: 'Interview', account: 'Account F', date: '2026-10-20', rationale: 'Time to first report directly tied to the outcome.', confidence: 'high'},
  {opp: 'template', verbatim: 'I scrolled through all the templates and none of them looked like a monthly board report.', source: 'Ticket', account: 'Account G', date: '2026-11-04', rationale: 'Cannot find a template matching the use case.', confidence: 'high'},
  {opp: 'template', verbatim: 'Templates are sorted by name, I would need them by what I’m trying to do.', source: 'Call', account: 'Account A', date: '2026-11-02', rationale: 'Template discovery by use case.', confidence: 'medium'},
  {opp: 'rebuild', verbatim: 'Every first of the month I rebuild the exact same report from scratch.', source: 'Call', account: 'Account H', date: '2026-11-05', rationale: 'Recurring rebuild of the same layout.', confidence: 'high'},
  {opp: 'charts', verbatim: 'Our charts turned into blurry pictures when we pasted them into slides.', source: 'Ticket', account: 'Account B', date: '2026-06-12', rationale: 'Before the “Export as image” release (Jul 2026); no evidence since.', confidence: 'high'},
  {opp: 'freshness', verbatim: 'I can’t tell when the data behind this chart was last refreshed.', source: 'Call', account: 'Account C', date: '2026-11-05', rationale: 'A new need not covered by the tree: proposed as a candidate.', confidence: 'medium'},
  {opp: 'external', verbatim: 'Our auditors want a link to the report, but they don’t have an account.', source: 'Ticket', account: 'Account I', date: '2026-10-28', rationale: 'External sharing; set aside under the current outcome.', confidence: 'high'},
];

export const solutions = [
  {opp: 'exports', name: 'Export presets saved per team', notion: 'https://www.notion.so/40f5d4385f6f8149af40f828d29666fa', status: 'to test', assumption: 'Teams always export to the same two or three formats', assumptionResult: 'untested'},
  {opp: 'exports', name: 'Apply a house style on export', notion: 'https://www.notion.so/40f5d4385f6f8126b467ef040a0fa8b7', status: 'idea'},
  {opp: 'start', name: 'Guided first report', notion: 'https://www.notion.so/40f5d4385f6f8166b814f1e848f7c87a', status: 'idea'},
  {opp: 'template', name: 'Template finder by use case', notion: 'https://www.notion.so/40f5d4385f6f81dfa079f69f75d7537d', status: 'to test', assumption: 'Templates can be tagged by use case without a rewrite', assumptionResult: 'untested'},
  {opp: 'rebuild', name: 'Duplicate last month’s report', notion: 'https://www.notion.so/40f5d4385f6f810c8dfcfaaa52b24010', status: 'testing', assumption: 'Users can find the duplicate action without help', assumptionResult: 'unclear'},
  {opp: 'charts', name: 'Export as image', notion: 'https://www.notion.so/40f5d4385f6f8188a868d3ae5fd48210', status: 'shipped', released: '2026-07-08'},
  {opp: 'external', name: 'Share link for external viewers', notion: 'https://www.notion.so/40f5d4385f6f81669b9cfb860eac6744', status: 'paused'},
];

export const pending = [
  {
    id: 'p1',
    kind: 'New opportunity',
    title: 'I’m not sure my numbers are up to date',
    detail: '3 pieces of evidence from 2 accounts, first seen today. Not covered by any existing opportunity.',
    opp: 'freshness',
  },
  {
    id: 'p2',
    kind: 'Learned rule',
    title: 'Data source questions are out of scope',
    detail: 'Drafted from the squad rejecting a “connect a new data source” opportunity on Oct 13. Replayed on history: 14 verbatims would move to out of scope.',
  },
];

export const changelog = [
  {date: '2026-11-05', change: 'Exports opportunity: +4 evidence, moved up from 3 to 2', by: 'agent'},
  {date: '2026-11-05', change: 'Candidate proposed: “I’m not sure my numbers are up to date”', by: 'agent'},
  {date: '2026-11-04', change: 'Template opportunity: +3 evidence', by: 'agent'},
  {date: '2026-11-03', change: 'Evidence about PDF page breaks moved to the exports opportunity', by: 'squad'},
  {date: '2026-11-02', change: 'Weekly synthesis: ranking updated, 1 rule learned', by: 'agent'},
  {date: '2026-10-30', change: 'Renamed “Exports are hard to use” to “I lose time reformatting my exports”', by: 'squad'},
  {date: '2026-10-13', change: 'Full history back to Mar 2023 merged into the calibrated tree', by: 'agent'},
];
