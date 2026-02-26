import { NextResponse } from 'next/server';
import { getMemories, createMemory, deleteMemory } from '@/lib/store';

export async function GET() {
  const memories = getMemories();
  return NextResponse.json(memories);
}

export async function POST(request: Request) {
  const body = await request.json();
  const memory = createMemory(body);
  return NextResponse.json(memory);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  deleteMemory(id);
  return NextResponse.json({ success: true });
}
