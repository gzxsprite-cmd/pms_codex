'use client';

import { useMemo, useState } from 'react';
import { fmtDate, toInputDate } from '@/lib/date';
import { taskStatuses, timelineStatuses } from '@/lib/constants';

type Team = { id: string; roleName: string; personName?: string|null; email?: string|null; department?: string|null; companyFunction?: string|null; comment?: string|null; sortOrder: number };
type Milestone = { id: string; milestoneCode: string; milestoneName: string; baselineDate?: string|null; actualDate?: string|null; status: string; comment?: string|null; sortOrder: number };
type Task = { id: string; taskCode: string; parentTaskId?: string|null; taskName: string; owner?: string|null; status: string; startDate?: string|null; dueDate?: string|null; progress: number; relatedMilestoneId?: string|null; comment?: string|null; sortOrder: number };
type Project = { id:string; projectId:string; name:string; customer:string; productPlatform:string; plantRegion?:string|null; phase:string; status:string; priority?:string|null; sopDate?:string|null; startDate?:string|null; endDate?:string|null; projectManager?:string|null; salesOwner?:string|null; comment?:string|null; teamMembers: Team[]; milestones: Milestone[]; tasks: Task[] };

const tabs = ['General Information', 'Team', 'Timelines', 'Delivery Tracking'] as const;

export default function ProjectDetailClient({ initial }: { initial: Project }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>('General Information');
  const [project, setProject] = useState(initial);
  const [viewMode, setViewMode] = useState<'list'|'gantt'>('list');

  const patchProject = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(body) });
    const data = await res.json();
    setProject(prev => ({ ...prev, ...data }));
  };
  const reload = async () => {
    const res = await fetch(`/api/projects/${project.id}`);
    setProject(await res.json());
  };

  const ganttRange = useMemo(() => {
    const dates = project.tasks.flatMap(t => [t.startDate, t.dueDate]).filter(Boolean).map(d => new Date(d as string).getTime());
    if (!dates.length) return { min: 0, max: 1 };
    return { min: Math.min(...dates), max: Math.max(...dates) };
  }, [project.tasks]);

  return <div className="space-y-4">
    <div className="rounded border bg-white p-4">
      <h1 className="text-xl font-semibold">{project.name}</h1>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
        <div><b>Customer:</b> {project.customer}</div><div><b>Product / Platform:</b> {project.productPlatform}</div><div><b>Status:</b> {project.status}</div><div><b>Phase:</b> {project.phase}</div><div><b>SOP Date:</b> {fmtDate(project.sopDate)}</div><div><b>Owner:</b> {project.projectManager ?? '-'}</div>
      </div>
    </div>

    <div className="flex gap-2">{tabs.map(t => <button key={t} className={`rounded px-3 py-1 text-sm ${tab===t?'bg-slate-800 text-white':'bg-white border'}`} onClick={()=>setTab(t)}>{t}</button>)}</div>

    {tab === 'General Information' && <div className="rounded border bg-white p-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        {[
          ['projectId','Project ID'],['name','Project Name'],['customer','Customer'],['productPlatform','Product / Platform'],['plantRegion','Plant / Region'],['phase','Project Phase'],['status','Project Status'],['priority','Priority'],['projectManager','Project Manager'],['salesOwner','Sales Owner']
        ].map(([key,label])=> <div key={key}><label className="text-xs">{label}</label><input value={(project as Record<string, string | undefined | null>)[key] ?? ''} onChange={e=>setProject({...project,[key]:e.target.value})}/></div>)}
        <div><label className="text-xs">SOP Date</label><input type="date" value={toInputDate(project.sopDate)} onChange={e=>setProject({...project,sopDate:e.target.value||null})}/></div>
        <div><label className="text-xs">Start Date</label><input type="date" value={toInputDate(project.startDate)} onChange={e=>setProject({...project,startDate:e.target.value||null})}/></div>
        <div><label className="text-xs">End Date</label><input type="date" value={toInputDate(project.endDate)} onChange={e=>setProject({...project,endDate:e.target.value||null})}/></div>
      </div>
      <div><label className="text-xs">Comment</label><textarea className="w-full" value={project.comment ?? ''} onChange={e=>setProject({...project,comment:e.target.value})}/></div>
      <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm" onClick={()=>patchProject(project)}>Save</button>
    </div>}

    {tab === 'Team' && <div className="rounded border bg-white p-4 space-y-2">
      <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm" onClick={async()=>{await fetch(`/api/projects/${project.id}/team`,{method:'POST',body:JSON.stringify({roleName:'New Role',sortOrder:project.teamMembers.length+1})});reload();}}>Add Role</button>
      <table><thead><tr><th>Role Name</th><th>Person Name</th><th>Email</th><th>Department</th><th>Company / Function</th><th>Comment</th><th></th></tr></thead>
      <tbody>{project.teamMembers.map(m => <tr key={m.id}>
        <td><input value={m.roleName} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,roleName:e.target.value}:x)})}/></td>
        <td><input value={m.personName ?? ''} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,personName:e.target.value}:x)})}/></td>
        <td><input value={m.email ?? ''} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,email:e.target.value}:x)})}/></td>
        <td><input value={m.department ?? ''} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,department:e.target.value}:x)})}/></td>
        <td><input value={m.companyFunction ?? ''} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,companyFunction:e.target.value}:x)})}/></td>
        <td><input value={m.comment ?? ''} onChange={e=>setProject({...project,teamMembers:project.teamMembers.map(x=>x.id===m.id?{...x,comment:e.target.value}:x)})}/></td>
        <td className="space-x-1"><button className="text-blue-600" onClick={async()=>{await fetch(`/api/team/${m.id}`,{method:'PATCH',body:JSON.stringify(m)});reload();}}>Save</button><button className="text-red-600" onClick={async()=>{await fetch(`/api/team/${m.id}`,{method:'DELETE'});reload();}}>Delete</button></td>
      </tr>)}</tbody></table>
    </div>}

    {tab === 'Timelines' && <div className="rounded border bg-white p-4 space-y-2">
      <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm" onClick={async()=>{await fetch(`/api/projects/${project.id}/milestones`,{method:'POST',body:JSON.stringify({milestoneCode:'NEW',milestoneName:'New Milestone',status:'NOT_STARTED',sortOrder:project.milestones.length+1})});reload();}}>Add Milestone</button>
      <table><thead><tr><th>Code</th><th>Name</th><th>Baseline</th><th>Actual</th><th>Status</th><th>Comment</th><th>Sort</th><th></th></tr></thead><tbody>
        {project.milestones.map(m => <tr key={m.id}><td><input value={m.milestoneCode} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,milestoneCode:e.target.value}:x)})}/></td>
        <td><input value={m.milestoneName} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,milestoneName:e.target.value}:x)})}/></td>
        <td><input type="date" value={toInputDate(m.baselineDate)} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,baselineDate:e.target.value}:x)})}/></td>
        <td><input type="date" value={toInputDate(m.actualDate)} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,actualDate:e.target.value}:x)})}/></td>
        <td><select value={m.status} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,status:e.target.value}:x)})}>{timelineStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
        <td><input value={m.comment ?? ''} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,comment:e.target.value}:x)})}/></td>
        <td><input type="number" value={m.sortOrder} onChange={e=>setProject({...project,milestones:project.milestones.map(x=>x.id===m.id?{...x,sortOrder:Number(e.target.value)}:x)})}/></td>
        <td className="space-x-1"><button className="text-blue-600" onClick={async()=>{await fetch(`/api/milestones/${m.id}`,{method:'PATCH',body:JSON.stringify(m)});reload();}}>Save</button><button className="text-red-600" onClick={async()=>{await fetch(`/api/milestones/${m.id}`,{method:'DELETE'});reload();}}>Delete</button></td></tr>)}
      </tbody></table>
    </div>}

    {tab === 'Delivery Tracking' && <div className="rounded border bg-white p-4 space-y-2">
      <div className="flex gap-2"><button className={`rounded px-2 py-1 text-sm ${viewMode==='list'?'bg-slate-800 text-white':'border'}`} onClick={()=>setViewMode('list')}>List</button><button className={`rounded px-2 py-1 text-sm ${viewMode==='gantt'?'bg-slate-800 text-white':'border'}`} onClick={()=>setViewMode('gantt')}>Gantt</button>
      <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm" onClick={async()=>{await fetch(`/api/projects/${project.id}/tasks`,{method:'POST',body:JSON.stringify({taskCode:'NEW',taskName:'New Task',status:'NOT_STARTED',sortOrder:project.tasks.length+1,progress:0})});reload();}}>Add Task</button></div>
      {viewMode==='list' ? <table><thead><tr><th>Task ID</th><th>Parent Task ID</th><th>Task Name</th><th>Owner</th><th>Status</th><th>Start</th><th>Due</th><th>Progress</th><th>Related Milestone</th><th>Comment</th><th>Sort</th><th></th></tr></thead><tbody>
        {project.tasks.map(t => <tr key={t.id}><td><input value={t.taskCode} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,taskCode:e.target.value}:x)})}/></td>
        <td><input value={t.parentTaskId ?? ''} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,parentTaskId:e.target.value}:x)})}/></td>
        <td><input value={t.taskName} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,taskName:e.target.value}:x)})}/></td>
        <td><input value={t.owner ?? ''} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,owner:e.target.value}:x)})}/></td>
        <td><select value={t.status} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,status:e.target.value}:x)})}>{taskStatuses.map(s => <option key={s}>{s}</option>)}</select></td>
        <td><input type="date" value={toInputDate(t.startDate)} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,startDate:e.target.value}:x)})}/></td>
        <td><input type="date" value={toInputDate(t.dueDate)} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,dueDate:e.target.value}:x)})}/></td>
        <td><input type="number" min={0} max={100} value={t.progress} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,progress:Number(e.target.value)}:x)})}/></td>
        <td><select value={t.relatedMilestoneId ?? ''} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,relatedMilestoneId:e.target.value||null}:x)})}><option value="">-</option>{project.milestones.map(m=><option key={m.id} value={m.id}>{m.milestoneCode} {m.milestoneName}</option>)}</select></td>
        <td><input value={t.comment ?? ''} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,comment:e.target.value}:x)})}/></td>
        <td><input type="number" value={t.sortOrder} onChange={e=>setProject({...project,tasks:project.tasks.map(x=>x.id===t.id?{...x,sortOrder:Number(e.target.value)}:x)})}/></td>
        <td className="space-x-1"><button className="text-blue-600" onClick={async()=>{await fetch(`/api/tasks/${t.id}`,{method:'PATCH',body:JSON.stringify(t)});reload();}}>Save</button><button className="text-red-600" onClick={async()=>{await fetch(`/api/tasks/${t.id}`,{method:'DELETE'});reload();}}>Delete</button></td></tr>)}
      </tbody></table> : <div className="space-y-2">{project.tasks.map(t=>{
        const start=t.startDate?new Date(t.startDate).getTime():ganttRange.min;
        const end=t.dueDate?new Date(t.dueDate).getTime():start;
        const total=Math.max(ganttRange.max-ganttRange.min,1);
        const left=((start-ganttRange.min)/total)*100;
        const width=(Math.max(end-start,86400000)/total)*100;
        return <div key={t.id} className="text-sm"><div>{t.taskCode} - {t.taskName} ({fmtDate(t.startDate)} ~ {fmtDate(t.dueDate)})</div><div className="relative h-4 bg-slate-100 rounded"><div className="absolute top-0 h-4 bg-blue-500 rounded" style={{left:`${left}%`, width:`${Math.max(width,2)}%`}}/></div></div>;
      })}</div>}
    </div>}
  </div>;
}
