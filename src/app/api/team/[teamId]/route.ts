import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { teamId: string } }) {
  const body = await req.json();
  const member = await prisma.projectTeamMember.update({ where: { id: params.teamId }, data: body });
  return NextResponse.json(member);
}

export async function DELETE(_: NextRequest, { params }: { params: { teamId: string } }) {
  await prisma.projectTeamMember.delete({ where: { id: params.teamId } });
  return NextResponse.json({ ok: true });
}
