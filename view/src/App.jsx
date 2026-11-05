import {useMemo, useState} from 'react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
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

// One visual language for status: plain words, no colored tags. Color is kept for the evidence bar only.
const STATUS = {
  active: 'Active',
  candidate: 'Candidate, to decide',
  parked: 'Parked',
  addressed: 'Addressed by a shipped feature',
};

const byId = Object.fromEntries(opportunities.map((o) => [o.id, o]));
// Priority is shown by order, never by a number on the card: a global rank reads like an outline number in a tree.
const byPriority = (a, b) => (a.rank ?? 99) - (b.rank ?? 99);
const childrenOf = (opp) => (opp.children ?? []).map((id) => byId[id]).sort(byPriority);
const maxEvidence = Math.max(...opportunities.map((o) => o.evidence));

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

function solutionLine(sols) {
  return sols.map((s) => `${s.name} (${s.status})`).join(' · ');
}

function OppCard({opp, onOpen, isChild}) {
  const sols = solutions.filter((s) => s.opp === opp.id);
  const share = Math.max(6, Math.round((opp.evidence / maxEvidence) * 100));
  const dim = opp.status === 'parked' || opp.status === 'addressed';
  return (
    <div className={`opp${isChild ? ' opp-child' : ''}${dim ? ' opp-dim' : ''}`}>
      <button type="button" className="opp-card" onClick={() => onOpen(opp.id)}>
        {opp.status !== 'active' || signalText(opp) ? (
          <span className="opp-top">
            {opp.status !== 'active' ? <span className="opp-status">{STATUS[opp.status]}</span> : null}
            {signalText(opp) ? <span className="signal">{signalText(opp)}</span> : null}
          </span>
        ) : null}
        <span className="opp-name">{opp.name}</span>
        <span className="opp-bar" aria-hidden="true">
          <span style={{width: `${share}%`}} />
        </span>
        <span className="opp-meta">
          {opp.evidence} evidence · {opp.accounts} accounts · last {formatDay(opp.lastEvidence)}
        </span>
      </button>
      {sols.length > 0 ? <p className="sol-line">Solutions: {solutionLine(sols)}</p> : null}
    </div>
  );
}

function TreeMap({onOpen}) {
  const roots = opportunities
    .filter((o) => !o.parent && o.status !== 'parked')
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  const parked = opportunities.filter((o) => o.status === 'parked');
  return (
    <div className="map">
      <div className="outcome-node">
        <Text type="supporting">Active outcome · since {formatDay(meta.outcomeSince)}</Text>
        <div className="outcome-text">{meta.outcome}</div>
      </div>
      <p className="map-legend">Highest priority first: branches from left to right, sub-opportunities from top to bottom.</p>
      <div className="branches">
        {roots.map((root) => (
          <div className="branch" key={root.id}>
            <OppCard opp={root} onOpen={onOpen} />
            {childrenOf(root).map((child) => (
              <OppCard key={child.id} opp={child} onOpen={onOpen} isChild />
            ))}
          </div>
        ))}
      </div>
      {parked.length > 0 ? (
        <div className="parked">
          <Text type="label">Parked under the current outcome</Text>
          <div className="parked-row">
            {parked.map((o) => (
              <OppCard key={o.id} opp={o} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TreeAsList({onOpen, selected}) {
  const toItem = (opp) => ({
    id: opp.id,
    label: opp.name,
    description: [
      opp.status !== 'active' ? STATUS[opp.status] : null,
      `${opp.evidence} evidence · ${opp.accounts} accounts`,
      signalText(opp),
    ]
      .filter(Boolean)
      .join(' · '),
    isSelected: selected === opp.id,
    onClick: () => onOpen(opp.id),
    isExpanded: true,
    children: [
      ...childrenOf(opp).map(toItem),
      ...solutions
        .filter((s) => s.opp === opp.id)
        .map((s) => ({
          id: `${opp.id}-${s.name}`,
          label: s.name,
          description: `Solution · ${s.status}`,
        })),
    ],
  });
  const items = [
    {
      id: 'outcome',
      label: meta.outcome,
      description: 'Active outcome',
      isExpanded: true,
      children: opportunities
        .filter((o) => !o.parent)
        .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
        .map(toItem),
    },
  ];
  return <TreeList items={items} aria-label="Opportunity Solution Tree" />;
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
  const sols = solutions.filter((s) => s.opp === oppId);
  const shipped = sols.find((s) => s.status === 'shipped');
  return (
    <Drawer isOpen={isOpen} onOpenChange={(open) => (!open ? onClose() : null)} label="Opportunity details" width={520}>
      {opp ? (
        <Layout
          header={<DrawerHeader title={opp.name} subtitle={opp.area} onOpenChange={(open) => (!open ? onClose() : null)} />}
          content={
            <LayoutContent>
              <div className="drawer-body">
                <MetadataList columns={2}>
                  <MetadataListItem label="Status">{STATUS[opp.status]}</MetadataListItem>
                  <MetadataListItem label="Priority, all levels">
                    {opp.rank ? `#${opp.rank}` : 'Not ranked'}
                    {opp.previousRank ? ` (was #${opp.previousRank})` : ''}
                  </MetadataListItem>
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
                  <p className="panel-text">Showing {items.length} of {opp.evidence}.</p>
                ) : null}

                {sols.length > 0 ? (
                  <>
                    <h3 className="drawer-h">Solutions</h3>
                    <ul className="sols">
                      {sols.map((s) => (
                        <li key={s.name}>
                          <span className="sol-name">{s.name}</span>
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
        <div className="head-title">
          <Text type="label">Opportunity Solution Tree · {meta.squad}</Text>
          <h1>{meta.outcome}</h1>
          <p className="north">North star: {meta.northStar}</p>
        </div>
        <Badge variant="warning" label="Demo data, fictional" />
      </header>

      <section className="recap" aria-labelledby="recap-title">
        <h2 id="recap-title" className="recap-title">Today · {meta.recap.analysed} analysed</h2>
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
        {tab === 'list' ? <TreeAsList onOpen={open} selected={openId} /> : null}
        {tab === 'pending' ? (
          <Pending decisions={decisions} onDecide={(id, d) => setDecisions((x) => ({...x, [id]: d}))} onOpen={open} />
        ) : null}
        {tab === 'changelog' ? <Changelog /> : null}
      </main>

      <footer className="foot">
        <span className="foot-item">
          Last refresh <Timestamp value={meta.lastRefresh} format="date_time" type="supporting" />
        </span>
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
