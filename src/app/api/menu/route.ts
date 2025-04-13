import { NextResponse } from 'next/server';
import { enhancedMenuData } from '@/lib/enhanced-menu-data';

export async function GET() {
  // Return the real menu data from the existing enhancedMenuData
  return NextResponse.json(enhancedMenuData);
} 