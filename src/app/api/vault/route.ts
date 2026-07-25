import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

/**
 * Vault API Bridge Endpoint
 * Handles secure IPC dispatch from Next.js HUD to the Sovereign Vault Python Enclave.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, agentId, memoryKey, memoryVal } = body;

    if (!action || !agentId) {
      return NextResponse.json(
        { error: "Missing required parameters: action and agentId are required." },
        { status: 400 }
      );
    }

    const pythonScriptPath = path.join(process.cwd(), "main.py");

    let command = `python3 ${pythonScriptPath} --agent-id "${agentId}"`;

    if (memoryKey) {
      command += ` --memory-key "${memoryKey}"`;
    }
    if (memoryVal) {
      command += ` --memory-val "${memoryVal}"`;
    }

    // Execute Python Sovereign Vault script inside local enclave
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        VAULT_ADDR: process.env.VAULT_ADDR || "https://127.0.0.1:8200",
        VAULT_TOKEN: process.env.VAULT_TOKEN || "",
      },
    });

    if (stderr && !stdout) {
      console.error("[Vault API Bridge Stderr]:", stderr);
      return NextResponse.json(
        { error: "Execution error inside Sovereign Vault enclave.", details: stderr },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Vault operation '${action}' executed successfully.`,
      logs: stdout.split("\n").filter(Boolean),
    });
  } catch (error: any) {
    console.error("[Vault API Bridge Exception]:", error);
    return NextResponse.json(
      { error: "Internal Server Error in Vault API Bridge", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Node_Active",
    service: "Sovereign Vault API Bridge",
    protocol: "HTTPS/Local IPC",
  });
}