import {createContext, useContext, useMemo, useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
import {Icon} from '@astryxdesign/core/Icon';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {Selector} from '@astryxdesign/core/Selector';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Timestamp} from '@astryxdesign/core/Timestamp';
import {TreeList} from '@astryxdesign/core/TreeList';
import {Text} from '@astryxdesign/core/Text';
import {
  changelog,
  evidence,
  isDemo,
  meta,
  opportunities,
  pending as pendingSeed,
  solutions,
} from './data.js';

// One visual language for status: plain words, no colored tags.
const STATUS = {
  active: 'Active',
  proposed: 'Waiting for a decision',
  candidate: 'Too early to rank',
  parked: 'Set aside for now',
  addressed: 'Addressed by a shipped feature',
};

const byPriority = (a, b) => (a.rank ?? 99) - (b.rank ?? 99);
const solutionsOf = (oppId) => solutions.filter((s) => s.opp === oppId);
// The tree holds the opportunities the squad works with. Proposed creations, candidates and set-aside ones sit below it.
const inTree = (o) => o.status === 'active' || o.status === 'addressed';

// Demo only: a decision taken on the card of a proposed creation changes what is shown. On a published page the
// decision is taken in Notion, on the row of the proposal in Changes, and the next run carries it out.
function applyDecisions(opps, decisions) {
  let list = opps.map((o) => ({...o}));
  const find = (id) => list.find((o) => o.id === id);
  Object.entries(decisions).forEach(([id, d]) => {
    const c = find(id);
    if (!c) return;
    if (d.action === 'accept') {
      c.status = 'active';
      c.parent = c.proposedParent ?? undefined;
      const parent = c.parent ? find(c.parent) : null;
      if (parent) parent.children = [...(parent.children ?? []), c.id];
    } else if (d.action === 'merge') {
      c.status = 'merged';
      const target = find(d.target);
      if (target) {
        target.evidence += c.evidence;
        target.accounts += c.accounts;
      }
    } else if (d.action === 'park') {
      c.status = 'parked';
    } else if (d.action === 'reject') {
      c.status = 'archived';
    }
  });
  return list;
}

function buildTree(opps) {
  const byId = Object.fromEntries(opps.map((o) => [o.id, o]));
  // Only ranked opportunities are numbered: a candidate under a parent sits below the tree with the other candidates.
  const childrenOf = (opp) => (opp.children ?? []).map((id) => byId[id]).filter((c) => c && inTree(c)).sort(byPriority);
  const roots = opps.filter((o) => !o.parent && inTree(o)).sort(byPriority);
  const proposed = opps.filter((o) => o.status === 'proposed');
  const candidates = opps
    .filter((o) => o.status === 'candidate')
    .sort((a, b) => b.accounts - a.accounts || (b.prospects ?? 0) - (a.prospects ?? 0) || b.evidence - a.evidence);
  const setAside = opps.filter((o) => o.status === 'parked');
  // Features (product areas) of the squad, in the order of their highest-priority branch.
  const features = [...new Set([...roots, ...proposed, ...candidates, ...setAside].map((o) => o.area).filter(Boolean))];
  // Outline numbers follow priority among siblings: 1, 2, 3 for branches; 1.1, 1.2 under branch 1.
  const numberOf = {};
  roots.forEach((root, i) => {
    numberOf[root.id] = `${i + 1}`;
    childrenOf(root).forEach((child, j) => {
      numberOf[child.id] = `${i + 1}.${j + 1}`;
    });
  });
  return {byId, childrenOf, roots, proposed, candidates, setAside, features, hasFeatures: features.length > 1, numberOf};
}

const TreeContext = createContext(null);
const useTree = () => useContext(TreeContext);

const DECISION_TEXT = {accept: 'Accepted', merge: 'Merged', park: 'Set aside', reject: 'Rejected'};

function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

const SOURCE_STATUS = {success: 'OK', warning: 'Partial', error: 'Failed', neutral: 'Not connected'};

// A date and time, or a date alone when the source gives no time.
function formatDateTime(iso) {
  if (!iso) return 'an unknown date';
  const [day, time] = iso.split('T');
  if (!time) return formatDay(day);
  // A time written with its zone (Z or an offset) is shown in the viewer's own time.
  if (/(Z|[+-]\d\d:?\d\d)$/.test(time)) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    return `${formatDay(local)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return `${formatDay(day)}, ${time.slice(0, 5)}`;
}

// Source health: one dot per source next to the recap title, and a banner when a source is not fully OK.
function SourceDots() {
  return (
    <ul className="source-dots" aria-label="Sources">
      {(meta.sources ?? []).map((s) => {
        const tip = `${s.name} (${s.tool}): ${SOURCE_STATUS[s.status]}. Last successful read ${formatDateTime(s.lastOk)}. ${s.detail}`;
        return (
          <li key={s.name} className={`source source-${s.status}`} title={tip}>
            <StatusDot variant={s.status} label={tip} />
            {s.name}
          </li>
        );
      })}
    </ul>
  );
}

function SourceAlerts() {
  const issues = (meta.sources ?? []).filter((s) => s.status === 'warning' || s.status === 'error');
  if (issues.length === 0) return null;
  return (
    <div className="source-alerts">
      {issues.map((s) => (
        <Banner
          key={s.name}
          status={s.status}
          title={`${s.name}: ${SOURCE_STATUS[s.status].toLowerCase()} since ${formatDateTime(s.lastOk)}`}
          description={s.detail}
        />
      ))}
    </div>
  );
}

function signalText(opp) {
  if (opp.isNewToday) return 'New today';
  if (opp.trend) return `+${opp.trend} today`;
  return null;
}

function plural(n, word) {
  return `${n} ${word}${n > 1 ? 's' : ''}`;
}

// Revenue in short form: 2.76M, 445k.
function formatArr(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return `${n}`;
}

function NotionLink({href, children, className}) {
  if (!href) return <span className={className}>{children}</span>;
  return (
    <a className={`notion-link ${className ?? ''}`} href={href} target="_blank" rel="noreferrer" title="Open in Notion">
      {children}
      <Icon icon="externalLink" size="xsm" color="secondary" />
    </a>
  );
}

function SolutionTree({sols, isOpen, onToggle}) {
  return (
    <div className="sol-block">
      <Collapsible
        trigger={<span className="sol-trigger">{plural(sols.length, 'solution')}</span>}
        isOpen={isOpen}
        onOpenChange={onToggle}
        chevronPosition="start"
      >
        <ul className="sol-tree">
          {sols.map((s) => (
            <li key={s.name}>
              <NotionLink href={s.notion} className="sol-name">{s.name}</NotionLink>
              <span className="sol-status">
                {s.status}
                {s.backlogStatus ? ` · backlog: ${s.backlogStatus}` : ''}
                {s.released ? ` · ${formatDay(s.released)}` : ''}
              </span>
              {s.assumption ? (
                <span className="sol-assumption">Riskiest assumption: {s.assumption} ({s.assumptionResult})</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Collapsible>
    </div>
  );
}

function CandidateActions({opp}) {
  const {byId, roots, childrenOf, numberOf, decide} = useTree();
  const [merging, setMerging] = useState(false);
  const parent = opp.proposedParent ? byId[opp.proposedParent] : null;
  const targets = roots.flatMap((r) => [r, ...childrenOf(r)]);
  return (
    <div className="cand">
      <p className="cand-where">
        {parent ? `Proposed under ${numberOf[parent.id]}. ${parent.name}` : 'Proposed as a new branch'}
        {opp.hesitation ? <span className="cand-why"> {opp.hesitation}</span> : null}
      </p>
      {isDemo && merging ? (
        <Selector
          label="Merge into"
          size="sm"
          placeholder="Choose an opportunity"
          options={targets.map((t) => ({value: t.id, label: `${numberOf[t.id]}. ${t.name}`}))}
          onChange={(value) => decide(opp.id, {action: 'merge', target: value})}
        />
      ) : null}
      {isDemo ? (
      <div className="actions">
        <Button label="Accept" variant="primary" size="sm" onClick={() => decide(opp.id, {action: 'accept'})} />
        <Button label="Merge with…" variant="secondary" size="sm" onClick={() => setMerging((m) => !m)} />
        <Button label="Set aside" variant="ghost" size="sm" onClick={() => decide(opp.id, {action: 'park'})} />
        <Button label="Reject" variant="ghost" size="sm" onClick={() => decide(opp.id, {action: 'reject'})} />
      </div>
      ) : (
        <p className="cand-where">
          <NotionLink href={opp.decideNotion} className="drawer-notion">Decide in Notion</NotionLink>
          <span className="cand-why"> The next run carries the decision out.</span>
        </p>
      )}
    </div>
  );
}

function OppCard({opp, onOpen, isChild, openSols, toggleSols, showFeature}) {
  const {numberOf, byId} = useTree();
  const sols = solutionsOf(opp.id);
  const dim = opp.status === 'parked' || opp.status === 'addressed';
  const number = numberOf[opp.id];
  const signal = signalText(opp);
  return (
    <div className={`opp${isChild ? ' opp-child' : ''}${dim ? ' opp-dim' : ''}`}>
      <div className="opp-card">
        {showFeature && !isChild && opp.area ? <span className="opp-feature">Feature: {opp.area}</span> : null}
        <div className="opp-head">
          {number ? <span className={`opp-num${isChild ? ' opp-num-child' : ''}`}>{number}</span> : null}
          <NotionLink href={opp.notion} className="opp-name">{opp.name}</NotionLink>
        </div>
        {opp.status !== 'active' ? <span className="opp-status">{STATUS[opp.status]}</span> : null}
        <button type="button" className="opp-stats" onClick={() => onOpen(opp.id)} title="See the evidence">
          <span className="stat">
            <span className="stat-n">{opp.evidence}</span>
            <span className="stat-l">evidence</span>
          </span>
          <span className="stat">
            <span className="stat-n">{opp.accounts}</span>
            <span className="stat-l">{opp.accounts === 1 ? 'account' : 'accounts'}</span>
          </span>
          {opp.prospects ? (
            <span className="stat">
              <span className="stat-n">{opp.prospects}</span>
              <span className="stat-l">{opp.prospects === 1 ? 'prospect' : 'prospects'}</span>
            </span>
          ) : null}
          {opp.arr ? (
            <span className="stat">
              <span className="stat-n">{formatArr(opp.arr)}</span>
              <span className="stat-l">ARR</span>
            </span>
          ) : null}
          {signal ? <Badge variant="info" label={signal} /> : null}
        </button>
        <span className="opp-last">
          Last evidence {formatDay(opp.lastEvidence)}
          {opp.byAgent ? (
            <span className="by-agent" title={opp.byAgent}>
              {' '}· {opp.byAgentLabel ?? 'Changed by the agent'}
            </span>
          ) : null}
        </span>
        {opp.signals ? <span className="opp-last">{opp.signals}</span> : null}
        {opp.status === 'candidate' && opp.parent && byId[opp.parent] ? (
          <span className="opp-last">Under: {byId[opp.parent].name}</span>
        ) : null}
        {opp.status === 'proposed' ? <CandidateActions opp={opp} /> : null}
      </div>
      {sols.length > 0 ? (
        <SolutionTree sols={sols} isOpen={openSols.has(opp.id)} onToggle={() => toggleSols(opp.id)} />
      ) : null}
    </div>
  );
}

function DecisionNotice() {
  const {lastDecision, byId, numberOf, undo} = useTree();
  if (!lastDecision) return null;
  const {id, action, target} = lastDecision;
  const opp = byId[id];
  const where =
    action === 'accept'
      ? ` It is now ${numberOf[id]} in the tree.`
      : action === 'merge'
        ? ` Its evidence now counts for ${numberOf[target]}. ${byId[target]?.name}.`
        : '';
  return (
    <Banner
      status="info"
      title={`${DECISION_TEXT[action]}: “${opp.name}”.${where}`}
      description="Demo only. In the live view, the decision is written to Notion and logged as a correction the agent learns from."
      endContent={<Button label="Undo" variant="ghost" size="sm" onClick={() => undo(id)} />}
    />
  );
}

function TreeMap({onOpen}) {
  const {roots, proposed, candidates, setAside, features, hasFeatures, childrenOf} = useTree();
  const withSolutions = opportunities.filter((o) => solutionsOf(o.id).length > 0).map((o) => o.id);
  const [openSols, setOpenSols] = useState(() => new Set());
  const allOpen = withSolutions.every((id) => openSols.has(id));
  const toggleSols = (id) =>
    setOpenSols((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const [feature, setFeature] = useState('all');
  const inFeature = (o) => feature === 'all' || o.area === feature;
  const cardProps = {onOpen, openSols, toggleSols, showFeature: hasFeatures && feature === 'all'};
  const shownRoots = roots.filter(inFeature);
  const shownProposed = proposed.filter(inFeature);
  const shownCandidates = candidates.filter(inFeature);
  const shownSetAside = setAside.filter(inFeature);

  return (
    <div className="map">
      <div className="outcome-node">
        {meta.outcome ? (
          <>
            <Text type="supporting">Active outcome{meta.outcomeSince ? ` · since ${formatDay(meta.outcomeSince)}` : ''}</Text>
            <NotionLink href={meta.outcomeNotion} className="outcome-text">{meta.outcome}</NotionLink>
          </>
        ) : (
          <>
            <Text type="supporting">{meta.focus ? 'What this tree is for' : 'No outcome yet'}</Text>
            <NotionLink href={meta.treeNotion} className="outcome-text">
              {meta.focus ?? 'Ranked on customer evidence alone'}
            </NotionLink>
            {meta.focus ? <Text type="supporting">No outcome yet: the tree is ranked on customer evidence alone.</Text> : null}
          </>
        )}
        {meta.northStar ? <Text type="supporting">North star: {meta.northStar}</Text> : null}
      </div>
      <div className="map-tools">
        <p className="map-legend">
          Numbered by priority: 1 is the top branch, 1.1 its top sub-opportunity. Titles open Notion; the counts open
          the verbatims. Accounts are customers; prospects are shown apart and do not move the rank.
        </p>
        <Button
          label={allOpen ? 'Hide all solutions' : 'Show all solutions'}
          variant="secondary"
          onClick={() => setOpenSols(allOpen ? new Set() : new Set(withSolutions))}
        />
      </div>
      <DecisionNotice />
      {hasFeatures ? (
        <div className="feature-filter">
          <SegmentedControl label="Feature" value={feature} onChange={setFeature} size="sm" layout="hug">
            <SegmentedControlItem value="all" label="All features" />
            {features.map((f) => (
              <SegmentedControlItem key={f} value={f} label={f} />
            ))}
          </SegmentedControl>
        </div>
      ) : null}
      <div className="branches">
        {shownRoots.length === 0 ? <p className="aside-note">No branch in the tree for this feature.</p> : null}
        {shownRoots.map((root) => (
          <div className="branch" key={root.id}>
            <OppCard opp={root} {...cardProps} />
            {childrenOf(root).map((child) => (
              <OppCard key={child.id} opp={child} isChild {...cardProps} />
            ))}
          </div>
        ))}
      </div>

      {shownProposed.length > 0 ? (
        <section className="aside" aria-labelledby="proposed-title">
          <h2 id="proposed-title" className="aside-title">Waiting for a decision</h2>
          <p className="aside-note">
            New needs the agent was not sure enough to add on its own. Accept one and it takes its place and number in the
            tree; merge it into an opportunity that says the same thing; set it aside; or reject it.
          </p>
          <div className="aside-row">
            {shownProposed.map((o) => (
              <OppCard key={o.id} opp={o} {...cardProps} />
            ))}
          </div>
        </section>
      ) : null}

      {shownCandidates.length > 0 ? (
        <section className="aside" aria-labelledby="candidates-title">
          <h2 id="candidates-title" className="aside-title">Too early to rank</h2>
          <p className="aside-note">
            Needs with fewer than 2 pieces of evidence from 2 customer accounts. They are not ranked yet; some are carried
            by prospects only.
          </p>
          <div className="aside-row">
            {shownCandidates.map((o) => (
              <OppCard key={o.id} opp={o} {...cardProps} />
            ))}
          </div>
        </section>
      ) : null}

      {shownSetAside.length > 0 ? (
        <section className="aside" aria-labelledby="aside-title">
          <h2 id="aside-title" className="aside-title">Set aside for now</h2>
          <p className="aside-note">
            Real needs that do not move the current outcome, so the squad chose not to work on them now. They keep their
            evidence and come back if the outcome changes.
          </p>
          <div className="aside-row">
            {shownSetAside.map((o) => (
              <OppCard key={o.id} opp={o} {...cardProps} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TreeAsList() {
  const {roots, proposed, candidates, setAside, hasFeatures, childrenOf, numberOf} = useTree();
  const solutionGroup = (opp) => {
    const sols = solutionsOf(opp.id);
    if (sols.length === 0) return [];
    return [
      {
        id: `${opp.id}-solutions`,
        label: plural(sols.length, 'solution'),
        isExpanded: false,
        children: sols.map((s) => ({
          id: `${opp.id}-${s.name}`,
          label: s.name,
          description: s.status,
          href: s.notion,
          target: '_blank',
        })),
      },
    ];
  };
  const toItem = (opp) => ({
    id: opp.id,
    label: numberOf[opp.id] ? `${numberOf[opp.id]}  ${opp.name}` : opp.name,
    description: [
      hasFeatures && !opp.parent ? opp.area : null,
      opp.status !== 'active' ? STATUS[opp.status] : null,
      `${opp.evidence} evidence · ${opp.accounts} accounts${opp.prospects ? ` · ${opp.prospects} prospects` : ''}${opp.arr ? ` · ARR ${formatArr(opp.arr)}` : ''}`,
      signalText(opp),
    ]
      .filter(Boolean)
      .join(' · '),
    href: opp.notion,
    target: '_blank',
    isExpanded: true,
    children: [...solutionGroup(opp), ...childrenOf(opp).map(toItem)],
  });
  const items = [
    {
      id: 'outcome',
      label: meta.outcome ?? meta.focus ?? 'No outcome yet',
      description: meta.outcome ? 'Active outcome' : 'No outcome yet: ranked on customer evidence alone',
      href: meta.outcomeNotion ?? meta.treeNotion,
      target: '_blank',
      isExpanded: true,
      children: roots.map(toItem),
    },
    {id: 'proposed', label: 'Waiting for a decision', isExpanded: true, children: proposed.map(toItem)},
    {id: 'candidates', label: 'Too early to rank', isExpanded: false, children: candidates.map(toItem)},
    {id: 'set-aside', label: 'Set aside for now', isExpanded: false, children: setAside.map(toItem)},
  ];
  return (
    <div className="outline">
      <p className="map-legend">Each line opens its Notion page.</p>
      <TreeList items={items} aria-label="Opportunity Solution Tree" />
    </div>
  );
}

function Pending({decisions, onDecide, onOpen}) {
  const {cardDecisions, decide} = useTree();
  // A proposal about a candidate shares its decision with the candidate's card in the tree.
  const approve = (p) => (p.opp ? decide(p.opp, {action: 'accept'}) : onDecide(p.id, 'Approved'));
  const reject = (p) => (p.opp ? decide(p.opp, {action: 'reject'}) : onDecide(p.id, 'Rejected'));
  return (
    <div className="pending">
      {pendingSeed.length === 0 ? (
        <p className="panel-text">Nothing is waiting for a decision. The proposals of the agent appear here after a run.</p>
      ) : null}
      {pendingSeed.map((p) => {
        const decision = p.opp && cardDecisions[p.opp] ? DECISION_TEXT[cardDecisions[p.opp].action] : decisions[p.id];
        return (
          <section className="panel" key={p.id} aria-labelledby={`${p.id}-title`}>
            <Text type="label">{p.kind}</Text>
            <h3 id={`${p.id}-title`} className="panel-title">{p.title}</h3>
            <p className="panel-text">{p.detail}</p>
            {decision ? (
              <p className="decided">
                <strong>{decision}.</strong>
                <span>Demo only. In the live view, this decision is written to Notion and logged in Corrections.</span>
              </p>
            ) : (
              <div className="actions">
                {isDemo ? (
                  <>
                    <Button label="Approve" variant="primary" onClick={() => approve(p)} />
                    <Button label="Reject" variant="secondary" onClick={() => reject(p)} />
                  </>
                ) : (
                  <NotionLink href={p.notion} className="drawer-notion">Decide in Notion</NotionLink>
                )}
                {p.opp ? <Button label="See the evidence" variant="ghost" onClick={() => onOpen(p.opp)} /> : null}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Changelog() {
  return (
    <ol className="changelog">
      {changelog.map((c, i) => (
        <li key={i}>
          <span className="cl-date">{formatDay(c.date)}</span>
          <span className="cl-change">{c.change}</span>
          <span className="cl-by">{c.by === 'squad' ? 'Squad' : 'Agent'}</span>
        </li>
      ))}
    </ol>
  );
}

function OppDrawer({isOpen, oppId, onClose}) {
  const {byId, numberOf} = useTree();
  const opp = oppId ? byId[oppId] : null;
  // A parent shows the evidence of its sub-opportunities with its own, as its counts do.
  const items = useMemo(() => evidence.filter((e) => e.opp === oppId || byId[e.opp]?.parent === oppId), [oppId, byId]);
  const sols = solutionsOf(oppId);
  const shipped = sols.find((s) => s.status === 'shipped');
  const place = opp
    ? numberOf[opp.id]
      ? `${numberOf[opp.id]}${opp.movedFrom ? ` (was ${opp.movedFrom})` : ''}`
      : STATUS[opp.status]
    : '';
  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => (!open ? onClose() : null)} label="Opportunity details" width={520}>
      {opp ? (
        <Layout
          header={<DrawerHeader title={opp.name} subtitle={opp.area} onOpenChange={(open) => (!open ? onClose() : null)} />}
          content={
            <LayoutContent>
              <div className="drawer-body">
                <NotionLink href={opp.notion} className="drawer-notion">Open in Notion</NotionLink>
                <MetadataList columns={2}>
                  <MetadataListItem label="Number in the tree">{place}</MetadataListItem>
                  <MetadataListItem label="Status">{STATUS[opp.status]}</MetadataListItem>
                  <MetadataListItem label="Evidence">{opp.evidence}</MetadataListItem>
                  <MetadataListItem label="Accounts">{opp.accounts}</MetadataListItem>
                  <MetadataListItem label="Prospects">{opp.prospects ?? 0}</MetadataListItem>
                  <MetadataListItem label="ARR of these accounts">{opp.arr ? formatArr(opp.arr) : 'Not known'}</MetadataListItem>
                  <MetadataListItem label="Signals">{opp.signals ?? 'None'}</MetadataListItem>
                  <MetadataListItem label="Last evidence">{formatDay(opp.lastEvidence)}</MetadataListItem>
                  <MetadataListItem label="Shipped solution">
                    {shipped ? `${shipped.name}, ${formatDay(shipped.released)}` : 'None found'}
                  </MetadataListItem>
                </MetadataList>

                {opp.status === 'addressed' ? (
                  <p className="note">No evidence since the release of “{shipped?.name}”: proposed as addressed. New evidence would make it active again.</p>
                ) : null}
                {opp.status === 'parked' ? (
                  <p className="note">Set aside: a real need that does not move the current outcome. It keeps its evidence and comes back if the outcome changes.</p>
                ) : null}

                <h3 className="drawer-h">Evidence</h3>
                {items.length === 0 ? (
                  <p className="panel-text">{isDemo ? 'No verbatim in the demo data for this opportunity.' : 'No evidence copied for this opportunity.'}</p>
                ) : (
                  <ul className="evidence">
                    {items.map((e, i) => (
                      <li key={i}>
                        <blockquote>“{e.verbatim}”</blockquote>
                        <div className="ev-meta">
                          {e.source} · {e.account}
                          {e.type === 'prospect' ? ' (prospect)' : ''} · {formatDay(e.date)}
                          {e.kind && e.kind !== 'need' ? ` · ${e.kind}` : ''}
                          {e.confidence && e.confidence !== 'high' ? ` · ${e.confidence} confidence` : ''}
                          {e.link ? (
                            <>
                              {' · '}
                              <a href={e.link} target="_blank" rel="noreferrer">source</a>
                            </>
                          ) : null}
                        </div>
                        <p className="ev-why">
                          {e.need ?? e.rationale}
                          {e.opp !== oppId && byId[e.opp]
                            ? numberOf[e.opp]
                              ? ` · sub-opportunity ${numberOf[e.opp]}`
                              : ` · ${byId[e.opp].name}`
                            : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                {items.length > 0 && items.length < opp.evidence ? (
                  <p className="panel-text">Showing {items.length} of {opp.evidence}. All of them are in Notion.</p>
                ) : null}

                {sols.length > 0 ? (
                  <>
                    <h3 className="drawer-h">Solutions</h3>
                    <ul className="sol-tree">
                      {sols.map((s) => (
                        <li key={s.name}>
                          <NotionLink href={s.notion} className="sol-name">{s.name}</NotionLink>
                          <span className="sol-status">
                {s.status}
                {s.backlogStatus ? ` · backlog: ${s.backlogStatus}` : ''}
                {s.released ? ` · ${formatDay(s.released)}` : ''}
              </span>
                          {s.assumption ? (
                            <span className="sol-assumption">
                              Riskiest assumption: {s.assumption} ({s.assumptionResult})
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            </LayoutContent>
          }
        />
      ) : (
        <div />
      )}
    </Drawer>
  );
}

export function App() {
  const [tab, setTab] = useState('map');
  const [openId, setOpenId] = useState(null);
  const [lastOpened, setLastOpened] = useState(null);
  const [decisions, setDecisions] = useState({});
  const [cardDecisions, setCardDecisions] = useState({});
  const [lastDecision, setLastDecision] = useState(null);
  const tree = useMemo(() => buildTree(applyDecisions(opportunities, cardDecisions)), [cardDecisions]);
  const decide = (id, d) => {
    setCardDecisions((x) => ({...x, [id]: d}));
    setLastDecision({id, ...d});
  };
  const undo = (id) => {
    setCardDecisions(({[id]: _, ...rest}) => rest);
    setLastDecision(null);
  };
  const pendingLeft = pendingSeed.filter((p) => !(p.opp ? cardDecisions[p.opp] : decisions[p.id])).length;

  const open = (id) => {
    setOpenId(id);
    setLastOpened(id);
  };

  return (
    <TreeContext.Provider value={{...tree, cardDecisions, decide, undo, lastDecision}}>
    <div className="page">
      <header className="head">
        <h1 className="page-title">Opportunity Solution Tree · {meta.squad}</h1>
        {isDemo ? (
          <Badge variant="warning" label="Demo data, fictional" />
        ) : (
          <Badge variant="info" label={`Copy of ${formatDateTime(meta.publishedAt)}`} />
        )}
      </header>

      <section className="recap" aria-labelledby="recap-title">
        <div className="recap-head">
          <h2 id="recap-title" className="recap-title">
            Last run, <Timestamp value={meta.lastRefresh} format="date_time" />
            {meta.recap?.analysed ? ` · ${meta.recap.analysed} analysed` : ''}
          </h2>
          <SourceDots />
        </div>
        <ul>
          {(meta.recap?.lines ?? []).map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <SourceAlerts />

      <TabList value={tab} onChange={setTab} hasDivider>
        <Tab value="map" label="Tree" />
        <Tab value="list" label="Outline" />
        <Tab value="pending" label={`Pending decisions${pendingLeft ? ` (${pendingLeft})` : ''}`} />
        <Tab value="changelog" label="Changelog" />
      </TabList>

      <main className="tab-body">
        {tab === 'map' ? <TreeMap onOpen={open} /> : null}
        {tab === 'list' ? <TreeAsList /> : null}
        {tab === 'pending' ? (
          <Pending decisions={decisions} onDecide={(id, d) => setDecisions((x) => ({...x, [id]: d}))} onOpen={open} />
        ) : null}
        {tab === 'changelog' ? <Changelog /> : null}
      </main>

      <footer className="foot">
        {isDemo ? null : (
          <span className="foot-item">
            A copy of the Notion tree, made on {formatDateTime(meta.publishedAt)}. It is refreshed at each run and on demand
            with /live-product-discovery:ost-view.
          </span>
        )}
        <span className="foot-item">
          Plugin v{meta.pluginVersion} ·{' '}
          <a href={meta.changelogUrl} target="_blank" rel="noreferrer">changelog</a>
        </span>
      </footer>

      <OppDrawer isOpen={Boolean(openId)} oppId={lastOpened} onClose={() => setOpenId(null)} />
    </div>
    </TreeContext.Provider>
  );
}
