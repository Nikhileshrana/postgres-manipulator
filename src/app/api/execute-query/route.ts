import { NextRequest, NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const { connectionString, query } = await request.json();

    // Validate inputs
    if (!connectionString || !query) {
      return NextResponse.json(
        { error: 'Connection string and query are required' },
        { status: 400 }
      );
    }

    // Basic validation for connection string format
    if (!connectionString.startsWith('postgres://')) {
      return NextResponse.json(
        { error: 'Invalid PostgreSQL connection string format' },
        { status: 400 }
      );
    }

    // Create a pool with the provided connection string
    const pool = createPool({ connectionString });

    try {
      // Execute the query
      const startTime = performance.now();
      const result = await pool.query(query);
      const endTime = performance.now();

      // Return the result
      return NextResponse.json({
        result: {
          rows: result.rows,
          rowCount: result.rowCount,
          command: result.command,
          executionTime: Math.round(endTime - startTime),
        },
      });
    } catch (queryError: any) {
      return NextResponse.json(
        { error: queryError.message || 'Error executing query' },
        { status: 500 }
      );
    } finally {
      // Ensure the pool is closed
      await pool.end();
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}