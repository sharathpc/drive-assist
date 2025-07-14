import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const result = await prisma.chat.findMany({
    where: {
      messages: {
        some: {
          data: {
            isNot: null
          }
        }
      }
    },
    include: {
      messages: {
        take: 1,
        where: {
          role: 'assistant'
        }
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
  });
  return NextResponse.json(result, { status: 200 })
}