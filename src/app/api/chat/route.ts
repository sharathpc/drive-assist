import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId: string = req.headers.get('User-Id') || '';
  
  const result = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      messages: {
        take: 3,
        where: {
          role: 'user'
        }
      },
    },
  });
  return NextResponse.json(result, { status: 200 })
}

export async function POST(req: NextRequest) {
  const userId: string = req.headers.get('User-Id') || '';
  const messages = await req.json();
  const result = await prisma.chat.create({
    data: {
      userId: userId,
      messages: {
        createMany: {
          data: messages
        }
      }
    },
  })
  return NextResponse.json(result, { status: 200 })
}

export async function DELETE(req: NextRequest) {
  const userId: string = req.headers.get('User-Id') || '';
  const result = await prisma.chat.deleteMany({
    where: {
      userId: userId,
    },
  })
  return NextResponse.json(result, { status: 200 })
}