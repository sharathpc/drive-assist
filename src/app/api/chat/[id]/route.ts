import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId: string = req.headers.get('User-Id') || '';
  const result = await prisma.chat.findUnique({
    where: {
      id: params.id,
      userId: userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          data: true
        }
      }
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId: string = req.headers.get('User-Id') || '';
  const result = await prisma.chat.delete({
    where: {
      id: params.id,
      userId: userId,
    },
  });
  return NextResponse.json(result, { status: 200 })
}