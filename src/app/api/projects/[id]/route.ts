import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      teamMembers: { orderBy: { sortOrder: 'asc' } },
      milestones: { orderBy: { sortOrder: 'asc' } },
      tasks: { orderBy: { sortOrder: 'asc' } }
    }
  });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const project = await prisma.project.update({ where: { id: params.id }, data: body });
  return NextResponse.json(project);
}
