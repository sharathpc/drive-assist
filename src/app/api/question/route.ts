import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const result = await prisma.question.findMany({
    orderBy: {
      sequence: 'asc'
    },
  });
    return NextResponse.json(result, { status: 200 })
  }