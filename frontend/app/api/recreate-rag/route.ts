import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST() {
  try {
    console.log('Starting RAG recreation process...');

    // Get the path to the Python script and virtual environment
    const scriptPath = join(process.cwd(), '..', 'src', 'recreate_rag.py');
    const venvPython = join(process.cwd(), '..', '.venv', 'bin', 'python');

    return new Promise((resolve) => {
      // Spawn Python process using virtual environment
      const pythonProcess = spawn(venvPython, [scriptPath], {
        cwd: join(process.cwd(), '..', 'src'),
        env: { ...process.env, PYTHONPATH: join(process.cwd(), '..', 'src') },
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log('RAG Recreation:', output.trim());
      });

      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        stderr += error;
        console.error('RAG Recreation Error:', error.trim());
      });

      pythonProcess.on('close', (code) => {
        console.log(`RAG recreation process exited with code ${code}`);

        if (code === 0) {
          resolve(
            NextResponse.json({
              success: true,
              message: 'RAG embeddings recreated successfully',
              stdout: stdout,
              stderr: stderr,
            })
          );
        } else {
          resolve(
            NextResponse.json(
              {
                success: false,
                message: 'Failed to recreate RAG embeddings',
                error: stderr,
                stdout: stdout,
              },
              { status: 500 }
            )
          );
        }
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start RAG recreation process:', error);
        resolve(
          NextResponse.json(
            {
              success: false,
              message: 'Failed to start RAG recreation process',
              error: error.message,
            },
            { status: 500 }
          )
        );
      });
    });
  } catch (error) {
    console.error('Error in RAG recreation API:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during RAG recreation',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
