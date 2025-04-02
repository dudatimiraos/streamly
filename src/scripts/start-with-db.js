// Script para iniciar o servidor Next.js e depois migrar o banco de dados
const { spawn } = require("child_process");
const path = require("path");

console.log("Iniciando o aplicativo Streamly com banco de dados...");

// Inicia o servidor Next.js
const nextProcess = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

// Registra handlers para erros e saída do processo Next.js
nextProcess.on("error", (err) => {
  console.error("Erro ao iniciar servidor Next.js:", err);
  process.exit(1);
});

// Espera 5 segundos para o servidor iniciar
console.log("Aguardando o servidor Next.js iniciar...");
setTimeout(() => {
  console.log("Iniciando migração do banco de dados...");

  // Executa o script de migração
  const migrateProcess = spawn("npm", ["run", "migrate-db"], {
    stdio: "inherit",
    shell: true,
  });

  migrateProcess.on("error", (err) => {
    console.error("Erro ao migrar banco de dados:", err);
  });

  migrateProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("Migração concluída com sucesso!");
      console.log("O aplicativo Streamly está pronto para uso em http://localhost:3000");
    } else {
      console.error(`Migração falhou com código de saída ${code}`);
      console.log("O aplicativo pode estar funcionando com dados de exemplo ou em memória.");
    }
  });
}, 5000);

// Encerrar o servidor Next.js quando este script for interrompido
process.on("SIGINT", () => {
  console.log("Encerrando o servidor Next.js...");
  nextProcess.kill("SIGINT");
  process.exit(0);
});
