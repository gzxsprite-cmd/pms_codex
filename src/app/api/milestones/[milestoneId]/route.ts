import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { milestoneId: string } }) {
  const body = await req.json();
  const x = await prisma.projectMilestone.update({ where: { id: params.milestoneId }, data: body });
  return NextResponse.json(x);
}

export async function DELETE(_: NextRequest, { params }: { params: { milestoneId: string } }) {
  await prisma.projectMilestone.delete({ where: { id: params.milestoneId } });
  return NextResponse.json({ ok: true });
}
