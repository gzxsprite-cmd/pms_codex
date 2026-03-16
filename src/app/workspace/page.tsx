'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fmtDate } from '@/lib/date';

type Project = {
  id: string; projectId: string; name: string; customer: string; productPlatform: string;
  phase: string; status: string; sopDate?: string | null; projectManager?: string | null; updatedAt: string;
};

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState('');
  const [phase, setPhase] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (phase) params.set('phase', phase);
    if (status) params.set('status', status);
    const res = await fetch(`/api/projects?${params.toString()}`);
    setProjects(await res.json());
  };

  useEffect(() => { load(); }, []);

  const phases = useMemo(() => Array.from(new Set(projects.map(p => p.phase))), [projects]);
  const statuses = useMemo(() => Array.from(new Set(projects.map(p => p.status))), [projects]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Workspace</h1>
      <div className="flex flex-wrap gap-2 items-end">
        <div><label className="text-xs">Search</label><input value={q} onChange={e => setQ(e.target.value)} placeholder="Project / Customer"/></div>
        <div><label className="text-xs">Phase</label><select value={phase} onChange={e => setPhase(e.target.value)}><option value="">All</option>{phases.map(v => <option key={v}>{v}</option>)}</select></div>
        <div><label className="text-xs">Status</label><select value={status} onChange={e => setStatus(e.target.value)}><option value="">All</option>{statuses.map(v => <option key={v}>{v}</option>)}</select></div>
        <button className="rounded bg-slate-800 text-white px-3 py-1 text-sm" onClick={load}>Apply</button>
        <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm" onClick={async()=>{const res=await fetch('/api/projects',{method:'POST'});const p=await res.json();window.location.href=`/projects/${p.id}`;}}>New Project</button>
      </div>

      <table>
        <thead><tr><th>Project ID</th><th>Project Name</th><th>Customer</th><th>Product / Platform</th><th>Phase</th><th>Status</th><th>SOP Date</th><th>Owner</th><th>Last Updated At</th></tr></thead>
        <tbody>{projects.map(p => (
          <tr key={p.id} className="hover:bg-slate-100">
            <td><Link className="text-blue-600 underline" href={`/projects/${p.id}`}>{p.projectId}</Link></td>
            <td>{p.name}</td><td>{p.customer}</td><td>{p.productPlatform}</td><td>{p.phase}</td><td>{p.status}</td><td>{fmtDate(p.sopDate)}</td><td>{p.projectManager ?? '-'}</td><td>{fmtDate(p.updatedAt)}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
