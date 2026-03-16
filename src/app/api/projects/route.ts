import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultRoles } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  const phase = req.nextUrl.searchParams.get('phase')?.trim();
  const status = req.nextUrl.searchParams.get('status')?.trim();

  const projects = await prisma.project.findMany({
    where: {
      AND: [
        q ? { OR: [{ name: { contains: q } }, { customer: { contains: q } }] } : {},
        phase ? { phase } : {},
        status ? { status } : {}
      ]
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json(projects);
}

export async function POST() {
  const count = await prisma.project.count();
  const project = await prisma.project.create({
    data: {
      projectId: `P-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`,
      name: `New Project ${count + 1}`,
      customer: 'TBD',
      productPlatform: 'TBD',
      phase: 'Initiation',
      status: 'Open',
      teamMembers: {
        create: defaultRoles.map((r, idx) => ({ roleName: r, sortOrder: idx }))
      }
    }
  });
  return NextResponse.json(project);
}
