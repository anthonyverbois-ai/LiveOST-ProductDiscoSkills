import {useMemo, useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Collapsible} from '@astryxdesign/core/Collapsible';
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
import {Icon} from '@astryxdesign/core/Icon';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Timestamp} from '@astryxdesign/core/Timestamp';
import {TreeList} from '@astryxdesign/core/TreeList';
import {Text} from '@astryxdesign/core/Text';
import {
  changelog,
  evidence,
  meta,
  opportunities,
  pending as pendingSeed,
  solutions,
} from './data.js';

// One visual language for status: plain words, no colored tags.
const STATUS = {
  active: 'Active',
  candidate: 'To decide',
  parked: 'Set aside for now',
  addressed: 'Addressed by a shipped feature',
};

const byId = Object.fromEntries(opportunities.map((o) => [o.id, o]));
const byPriority = (a, b) => (a.rank ?? 99) - (b.rank ?? 99);
const childrenOf = (opp) => (opp.children ?? []).map((id) => byId[id]).sort(byPriority);
const solutionsOf = (oppId) => solutions.filter((s) => s.opp === oppId);
const maxEvidence = Math.max(...opportunities.map((o) => o.evidence));

// The tree holds the opportunities the squad works with. Candidates and set-aside ones sit below it.
const inTree = (o) => o.status === 'active' || o.status === 'addressed';
const roots = opportunities.filter((o) => !o.parent && inTree(o)).sort(byPriority);
const candidates = opportunities.filter((o) => o.status === 'candidate');
const setAside = opportunities.filter((o) => o.status === 'parked');

// Outline numbers follow priority among siblings: 1, 2, 3 for branches; 1.1, 1.2 under branch 1.
const numberOf = {};
roots.forEach((root, i) => {
  numberOf[root.id] = `${i + 1}`;
  childrenOf(root).forEach((child, j) => {
    numberOf[child.id] = `${i + 1}.${j + 1}`;
  });
});

function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

function signalText(opp) {
  if (opp.isNewToday) return 'New today';
  if (opp.trend) return `+${opp.trend} today`;
  return null;
}

function plural(n, word) {
  return `${n} ${word}${n > 1 ? 's' : ''}`;
}

function NotionLink({href, children, className}) {
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
              <span className="sol-status">{s.status}</span>
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

function OppCard({opp, onOpen, isChild, openSols, toggleSols}) {
  const sols = solutionsOf(opp.id);
  const share = Math.max(6, Math.round((opp.evidence / maxEvidence) * 100));
  const dim = opp.status === 'parked' || opp.status === 'addressed';
  const number = numberOf[opp.id];
  const signal = signalText(opp);
  return (
    <div className={`opp${isChild ? ' opp-child' : ''}${dim ? ' opp-dim' : ''}`}>
      <div className="opp-card">
        <div className="opp-head">
          {number ? <span className={`opp-num${isChild ? ' opp-num-child' : ''}`}>{number}</span> : null}
          <NotionLink href={opp.notion} className="opp-name">{opp.name}</NotionLink>
        </div>
        {opp.status !== 'active' ? <span className="opp-status">{STATUS[opp.status]}</span> : null}
        <button type="button" className="opp-stats" onClick={() => onOpen(opp.id)}>
          <span className="stat">
            <span className="stat-n">{opp.evidence}</span>
            <span className="stat-l">evidence</span>
          </span>
          <span className="stat">
            <span className="stat-n">{opp.accounts}</span>
            <span className="stat-l">accounts</span>
          </span>
          {signal ? <Badge variant="info" label={signal} /> : null}
          <span className="see-ev">See evidence</span>
        </button>
        <span className="opp-bar" aria-hidden="true">
          <span style={{width: `${share}%`}} />
        </span>
        <span className="opp-last">Last evidence {formatDay(opp.lastEvidence)}</span>
      </div>
      {sols.length > 0 ? (
        <SolutionTree sols={sols} isOpen={openSols.has(opp.id)} onToggle={() => toggleSols(opp.id)} />
      ) : null}
    </div>
  );
}

function TreeMap({onOpen}) {
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
  const cardProps = {onOpen, openSols, toggleSols};

  return (
    <div className="map">
      <div className="outcome-node">
        <Text type="supporting">Active outcome · since {formatDay(meta.outcomeSince)}</Text>
        <NotionLink href={meta.outcomeNotion} className="outcome-text">{meta.outcome}</NotionLink>
        {meta.northStar ? <Text type="supporting">North star: {meta.northStar}</Text> : null}
      </div>
      <div className="map-tools">
        <p className="map-legend">
          Numbered by priority: 1 is the top branch, 1.1 its top sub-opportunity. Titles open Notion; the numbers of
          evidence open the verbatims.
        </p>
        <Button
          label={allOpen ? 'Hide all solutions' : 'Show all solutions'}
          variant="secondary"
          onClick={() => setOpenSols(allOpen ? new Set() : new Set(withSolutions))}
        />
      </div>
      <div className="branches">
        {roots.map((root) => (
          <div className="branch" key={root.id}>
            <OppCard opp={root} {...cardProps} />
            {childrenOf(root).map((child) => (
              <OppCard key={child.id} opp={child} isChild {...cardProps} />
            ))}
          </div>
        ))}
      </div>

      {candidates.length > 0 ? (
        <section className="aside" aria-labelledby="candidates-title">
          <h2 id="candidates-title" className="aside-title">Waiting for a decision</h2>
          <p className="aside-note">
            New needs proposed by the agent. Accept one in Pending decisions and it gets a place and a number in the tree.
          </p>
          <div className="aside-row">
            {candidates.map((o) => (
              <OppCard key={o.id} opp={o} {...cardProps} />
            ))}
          </div>
        </section>
      ) : null}

      {setAside.length > 0 ? (
        <section className="aside" aria-labelledby="aside-title">
          <h2 id="aside-title" className="aside-title">Set aside for now</h2>
          <p className="aside-note">
            Real needs that do not move the current outcome, so the squad chose not to work on them now. They keep their
            evidence and come back if the outcome changes.
          </p>
          <div className="aside-row">
            {setAside.map((o) => (
              <OppCard key={o.id} opp={o} {...cardProps} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TreeAsList() {
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
      opp.status !== 'active' ? STATUS[opp.status] : null,
      `${opp.evidence} evidence · ${opp.accounts} accounts`,
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
      label: meta.outcome,
      description: 'Active outcome',
      href: meta.outcomeNotion,
      target: '_blank',
      isExpanded: true,
      children: roots.map(toItem),
    },
    {id: 'candidates', label: 'Waiting for a decision', isExpanded: true, children: candidates.map(toItem)},
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
  return (
    <div className="pending">
      {pendingSeed.map((p) => {
        const decision = decisions[p.id];
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
                <Button label="Approve" variant="primary" onClick={() => onDecide(p.id, 'Approved')} />
                <Button label="Reject" variant="secondary" onClick={() => onDecide(p.id, 'Rejected')} />
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
  const opp = oppId ? byId[oppId] : null;
  const items = useMemo(() => evidence.filter((e) => e.opp === oppId), [oppId]);
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
                  <p className="panel-text">No verbatim in the demo data for this opportunity.</p>
                ) : (
                  <ul className="evidence">
                    {items.map((e, i) => (
                      <li key={i}>
                        <blockquote>“{e.verbatim}”</blockquote>
                        <div className="ev-meta">
                          {e.source} · {e.account} · {formatDay(e.date)}
                          {e.confidence !== 'high' ? ` · ${e.confidence} confidence` : ''}
                        </div>
                        <p className="ev-why">{e.rationale}</p>
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
                          <span className="sol-status">{s.status}</span>
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
  const pendingLeft = pendingSeed.filter((p) => !decisions[p.id]).length;

  const open = (id) => {
    setOpenId(id);
    setLastOpened(id);
  };

  return (
    <div className="page">
      <header className="head">
        <h1 className="page-title">Opportunity Solution Tree · {meta.squad}</h1>
        <Badge variant="warning" label="Demo data, fictional" />
      </header>

      <section className="recap" aria-labelledby="recap-title">
        <h2 id="recap-title" className="recap-title">
          Last run, <Timestamp value={meta.lastRefresh} format="date_time" /> · {meta.recap.analysed} analysed
        </h2>
        <ul>
          {meta.recap.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

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
        <span className="foot-item foot-sources">
          {meta.sources.map((s) => (
            <span key={s.name} className="source">
              <StatusDot variant={s.status} label={s.detail} tooltip={s.detail} />
              {s.name}
            </span>
          ))}
        </span>
        <span className="foot-item">
          Plugin v{meta.pluginVersion} ·{' '}
          <a href={meta.changelogUrl} target="_blank" rel="noreferrer">changelog</a>
        </span>
      </footer>

      <OppDrawer isOpen={Boolean(openId)} oppId={lastOpened} onClose={() => setOpenId(null)} />
    </div>
  );
}
