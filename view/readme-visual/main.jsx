// The image at the top of the README, drawn with the components and theme of the visual tree.
// It is a picture, not a page anyone opens: build it, then take a screenshot (see README.md in this folder).
// Every name, account and number here is fictional.
import {useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';
import {Badge} from '@astryxdesign/core/Badge';
import {Blockquote} from '@astryxdesign/core/Blockquote';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowRight, Database, FileText, ListChecks, MessageSquare, Phone, Ticket} from 'lucide-react';

const SOURCES = [
  {icon: Phone, label: 'Calls'},
  {icon: Ticket, label: 'Tickets'},
  {icon: MessageSquare, label: 'Chat'},
  {icon: FileText, label: 'Docs'},
  {icon: ListChecks, label: 'Backlog'},
  {icon: Database, label: 'Product data'},
];

function Step({n, title, children}) {
  return (
    <li className="step">
      <span className="step-n">{n}</span>
      <div className="step-body">
        <h3 className="step-title">{title}</h3>
        {children}
      </div>
    </li>
  );
}

function Morning() {
  return (
    <section className="morning">
      <h2 className="panel-title">Every morning</h2>
      <p className="panel-sub">The agent runs on its own</p>
      <ol className="steps">
        <Step n={1} title="Reads what is new">
          <ul className="sources">
            {SOURCES.map((s) => (
              <li key={s.label} className="source-tile">
                <Icon icon={s.icon} size="md" color="secondary" />
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="muted">3 calls · 7 tickets · 2 messages since yesterday, with usage and ARR per account</p>
        </Step>
        <Step n={2} title="Maps everything onto the tree">
          <Blockquote cite="Account A · call">“I rebuild the same export every Monday.”</Blockquote>
          <p className="maps-to">
            <Icon icon={ArrowRight} size="sm" color="success" /> opportunity <b>I lose time reformatting my exports</b>
          </p>
          <p className="maps-to">
            <Badge variant="yellow" label="REP-142" />
            <Icon icon={ArrowRight} size="sm" color="success" /> solution <b>Paste charts as images</b>
          </p>
        </Step>
        <Step n={3} title="Sends a short recap">
          <div className="recap">
            <p className="recap-title">Last run · 12 pieces of evidence attached</p>
            <ul>
              <li>Trending: I lose time reformatting my exports</li>
              <li>Created: I’m not sure my numbers are up to date</li>
              <li>Linked: REP-142 to Paste charts as images</li>
            </ul>
          </div>
        </Step>
      </ol>
      <p className="muted footnote">
        When it wants to, the squad decides and corrects in Notion or asks Claude to undo; the agent learns.
      </p>
    </section>
  );
}

// The same counts as the visual tree's cards: customer accounts first and in bold, since they make the rank.
function Stats({accounts, evidence, arr}) {
  return (
    <span className="opp-stats">
      <span className="stat stat-rank">
        <span className="stat-n">{accounts}</span>
        <span className="stat-l">customer accounts</span>
      </span>
      <span className="stat">
        <span className="stat-n">{evidence}</span>
        <span className="stat-l">evidence</span>
      </span>
      {arr ? (
        <span className="stat">
          <span className="stat-n">{arr}</span>
          <span className="stat-l">ARR</span>
        </span>
      ) : null}
    </span>
  );
}

function Opp({id, parent, num, name, accounts, evidence, arr, badge, col, row}) {
  return (
    <div className="node opp-card" data-id={id} data-parent={parent} style={{gridColumn: col, gridRow: row}}>
      {badge ? <span className="node-badge">{badge}</span> : null}
      <div className="opp-head">
        <span className={`opp-num${String(num).includes('.') ? ' opp-num-child' : ''}`}>{num}</span>
        <span className="opp-name">{name}</span>
      </div>
      <Stats accounts={accounts} evidence={evidence} arr={arr} />
    </div>
  );
}

function Sol({id, parent, name, status, ticket, col, row}) {
  return (
    <div className="node sol-node" data-id={id} data-parent={parent} style={{gridColumn: col, gridRow: row}}>
      <span className="sol-name">{name}</span>
      <span className="sol-status">
        {ticket ? <Badge variant="yellow" label={ticket} /> : null}
        {status}
      </span>
    </div>
  );
}

// Elbow connectors from each node to its parent, measured once the cards are laid out.
function useConnectors(ref) {
  const [paths, setPaths] = useState([]);
  useLayoutEffect(() => {
    const root = ref.current;
    const box = root.getBoundingClientRect();
    const byId = {};
    root.querySelectorAll('[data-id]').forEach((el) => (byId[el.dataset.id] = el.getBoundingClientRect()));
    const out = [];
    root.querySelectorAll('[data-parent]').forEach((el) => {
      const p = byId[el.dataset.parent];
      const c = byId[el.dataset.id];
      if (!p || !c) return;
      const x1 = p.left + p.width / 2 - box.left;
      const y1 = p.bottom - box.top;
      const x2 = c.left + c.width / 2 - box.left;
      const y2 = c.top - box.top;
      const mid = y1 + (y2 - y1) / 2;
      out.push(`M${x1} ${y1} V${mid} H${x2} V${y2}`);
    });
    setPaths(out);
  }, [ref]);
  return paths;
}

function Tree() {
  const ref = useRef(null);
  const paths = useConnectors(ref);
  return (
    <section className="tree-panel">
      <h2 className="panel-title title-with-badge">
        Your Opportunity Solution Tree, always up to date <Badge variant="neutral" label="Concept explained" />
      </h2>
      <p className="panel-sub">Teresa Torres’ framework, fed every day by real customer evidence</p>
      <div className="tree" ref={ref}>
        <svg className="links" aria-hidden="true">
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
        <span className="level" style={{gridRow: 1}}>Outcome</span>
        <span className="level" style={{gridRow: 2}}>Opportunities</span>
        <span className="level" style={{gridRow: 3}}>Sub-opportunities</span>
        <span className="level" style={{gridRow: 4}}>Solutions</span>

        <div className="node outcome" data-id="o" style={{gridColumn: '2 / 5', gridRow: 1}}>
          <span className="outcome-text">Reduce the time to build a first report from 3 days to 1 day</span>
          <span className="muted">Active outcome</span>
        </div>

        <Opp id="a" parent="o" num={1} name="I don’t know where to start building a report" accounts={11} evidence={26} arr="520k" col={2} row={2} />
        <Opp
          id="b"
          parent="o"
          num={2}
          name="I lose time reformatting my exports"
          accounts={7}
          evidence={18}
          arr="310k"
          badge={<Badge variant="green" label="+4 today" />}
          col={3}
          row={2}
        />
        <Opp
          id="c"
          parent="o"
          num={3}
          name="I’m not sure my numbers are up to date"
          accounts={2}
          evidence={3}
          arr="45k"
          badge={<Badge variant="blue" label="New" />}
          col={4}
          row={2}
        />
        <Opp id="a1" parent="a" num="1.1" name="I can’t find the right template for my use case" accounts={8} evidence={14} arr="380k" col={2} row={3} />
        <Opp id="b1" parent="b" num="2.1" name="Charts break when I paste them elsewhere" accounts={4} evidence={9} arr="150k" col={3} row={3} />
        <Sol id="s1" parent="a1" name="Template gallery" status="In discovery" col={2} row={4} />
        <Sol id="s2" parent="b1" name="Paste charts as images" status="In delivery" ticket="REP-142" col={3} row={4} />
      </div>
      <ul className="legend">
        <li>
          <Badge variant="green" label="+4 today" /> gained evidence since yesterday
        </li>
        <li>
          <Badge variant="blue" label="New" /> created by the agent from a clear need
        </li>
        <li>
          <Badge variant="yellow" label="REP-142" /> backlog item; its delivery status follows the tracker
        </li>
      </ul>
      <p className="muted footnote">Customer accounts make the rank; ARR comes from your product data and breaks ties. A concept view with fictional data: the visual tree shows the same cards, laid out by branch.</p>
    </section>
  );
}

function Visual() {
  return (
    <main className="visual" id="visual">
      <Morning />
      <div className="between" aria-hidden="true">
        <Icon icon={ArrowRight} size="lg" color="tertiary" />
      </div>
      <Tree />
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <Theme theme={neutralTheme} mode="light">
    <Visual />
  </Theme>,
);
