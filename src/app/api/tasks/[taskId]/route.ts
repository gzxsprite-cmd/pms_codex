import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
  const body = await req.json();
  const x = await prisma.projectTask.update({ where: { id: params.taskId }, data: body });
  return NextResponse.json(x);
}

export async function DELETE(_: NextRequest, { params }: { params: { taskId: string } }) {
  await prisma.projectTask.delete({ where: { id: params.taskId } });
  return NextResponse.json({ ok: true });
}
