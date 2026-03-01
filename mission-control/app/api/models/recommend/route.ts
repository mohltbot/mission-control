import { NextResponse } from 'next/server';
import { recommendModel, TaskType, ModelTier } from '@/lib/model-router';

// POST /api/models/recommend - Get model recommendations for a task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.task) {
      return NextResponse.json(
        { error: 'Missing required field: task' },
        { status: 400 }
      );
    }
    
    const recommendations = recommendModel(
      body.task as TaskType,
      body.tier as ModelTier || 'balanced',
      body.requiredCapabilities || [],
      body.maxCost
    );
    
    return NextResponse.json({
      task: body.task,
      tier: body.tier || 'balanced',
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
    });
  } catch (error) {
    console.error('Error recommending models:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
