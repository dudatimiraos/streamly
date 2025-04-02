import { NextResponse } from "next/server";
import { db } from "@/db";
import path from "path";
import fs from "fs";

// GET /api/db-health
export async function GET() {
  try {
    const dbPath = path.resolve(process.cwd(), "streamly.db");
    const dbExists = fs.existsSync(dbPath);

    // Stats do arquivo do banco
    let stats = null;
    if (dbExists) {
      stats = fs.statSync(dbPath);
    }

    // Tenta acessar o driver SQLite
    const driver = (db as any).driver;
    const driverExists = !!driver;
    
    // Verifica os métodos disponíveis no driver
    const methods = driverExists ? {
      exec: typeof driver.exec === 'function',
      prepare: typeof driver.prepare === 'function',
      pragma: typeof driver.pragma === 'function',
    } : null;

    // Verifica se o banco está funcionando tentando uma query simples
    let dbWorking = false;
    let tables = [];

    if (driverExists && methods?.prepare) {
      try {
        tables = driver.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        dbWorking = true;
      } catch (err) {
        console.error("Erro ao testar banco de dados:", err);
      }
    }

    return NextResponse.json({
      success: true,
      dbPath,
      dbExists,
      dbSize: stats ? `${(stats.size / 1024).toFixed(2)} KB` : null,
      dbLastModified: stats ? new Date(stats.mtime).toISOString() : null,
      driverExists,
      driverMethods: methods,
      dbWorking,
      tables: tables.map((t) => t.name),
      nodeEnv: process.env.NODE_ENV || "development",
      cwd: process.cwd(),
      betterSqliteVersion: require('better-sqlite3/package.json').version,
      userPermissions: {
        canRead: dbExists ? fs.accessSync(dbPath, fs.constants.R_OK) || true : false,
        canWrite: dbExists ? fs.accessSync(dbPath, fs.constants.W_OK) || true : false,
      },
    });
  } catch (error) {
    console.error("Erro ao verificar saúde do banco:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Falha ao verificar saúde do banco de dados",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
