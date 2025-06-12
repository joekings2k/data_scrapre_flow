'use server';

import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function setupUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error('Unauthenticated');
  }
  const balance = await prisma.userBalance.findUnique({
    where: {
      userId,
    },
  });
  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }
  redirect('/')
}
