import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await prisma.chat.findUnique({
    where: {
      id: params.id,
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