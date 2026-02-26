import { NextResponse } from 'next/server';
import { updatePricing, getPricingInfo } from '@/lib/expense-tracker';

// GET current pricing info
export async function GET() {
  const info = getPricingInfo();
  return NextResponse.json(info);
}

// POST to update pricing for a model
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.provider || !body.model || body.input === undefined || body.output === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, input, output' },
        { status: 400 }
      );
    }
    
    // Update the pricing
    updatePricing(
      body.provider,
      body.model,
      body.input,
      body.output,
      body.currency || 'USD'
    );
    
    return NextResponse.json({
      success: true,
      message: `Updated pricing for ${body.provider}/${body.model}`,
      pricing: {
        provider: body.provider,
        model: body.model,
        input: body.input,
        output: body.output,
        currency: body.currency || 'USD',
      },
    });
  } catch (error) {
    console.error('Error updating pricing:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing' },
      { status: 500 }
    );
  }
}
