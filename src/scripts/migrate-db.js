// Script para inicializar o banco de dados
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");

// Verificar se o arquivo do banco existe
const dbPath = path.resolve(process.cwd(), "streamly.db");
const dbExists = fs.existsSync(dbPath);

console.log("Verificando banco de dados em:", dbPath);

if (dbExists) {
  console.log("Banco de dados já existe.");
  console.log("Se quiser recriar o banco de dados, exclua o arquivo e execute este script novamente.");
} else {
  console.log("Inicializando banco de dados...");
  
  // Função para fazer a requisição HTTP para a API
  function migrarBancoDados() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/api/db-migrate",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      const req = http.request(options, (res) => {
        let data = "";
        
        res.on("data", (chunk) => {
          data += chunk;
        });
        
        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              const result = JSON.parse(data);
              resolve(result);
            } catch (error) {
              reject(new Error(`Erro ao processar resposta: ${error.message}`));
            }
          } else {
            reject(new Error(`Erro na resposta: ${res.statusCode}`));
          }
        });
      });
      
      req.on("error", (error) => {
        reject(new Error(`Erro na requisição: ${error.message}`));
      });
      
      req.end();
    });
  }
  
  // Tenta migrar o banco de dados
  migrarBancoDados()
    .then((result) => {
      console.log("Migração concluída com sucesso!");
      console.log("Resposta:", JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(`Erro na migração: ${error.message}`);
      console.log("Certifique-se de que o servidor Next.js está em execução na porta 3000.");
      console.log("Execute 'npm run dev' em outro terminal e tente novamente.");
      process.exit(1);
    });
}
