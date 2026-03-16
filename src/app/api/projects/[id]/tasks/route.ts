import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const x = await prisma.projectTask.create({ data: { projectRef: params.id, ...body } });
  return NextResponse.json(x);
}
