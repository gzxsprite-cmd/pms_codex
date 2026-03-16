import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProjectDetailClient from '@/components/project-tabs/project-detail-client';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      teamMembers: { orderBy: { sortOrder: 'asc' } },
      milestones: { orderBy: { sortOrder: 'asc' } },
      tasks: { orderBy: { sortOrder: 'asc' } }
    }
  });

  if (!project) return <div>Project not found. <Link href="/workspace" className="underline text-blue-600">Back</Link></div>;

  return <div className="space-y-4">
    <Link href="/workspace" className="text-blue-600 underline">← Back to Workspace</Link>
    <ProjectDetailClient initial={JSON.parse(JSON.stringify(project))} />
  </div>;
}
