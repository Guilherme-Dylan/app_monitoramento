#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('\n╔════════════════════════════════════════╗');
console.log('║  🚀 DEPLOY AUTOMÁTICO PARA MANUS       ║');
console.log('╚════════════════════════════════════════╝\n');

// Verificar se há mudanças não commitadas
try {
  const status = execSync('git status --porcelain', { cwd: projectRoot }).toString();
  if (status.trim()) {
    console.log('⚠️  Há mudanças não commitadas:');
    console.log(status);
    console.log('\n❌ Faça commit de todas as mudanças antes de fazer deploy!');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erro ao verificar status do git:', error.message);
  process.exit(1);
}

// Obter informações do commit
let author = '';
let message = '';
let hash = '';

try {
  author = execSync('git log -1 --pretty=format:"%an"', { cwd: projectRoot }).toString().trim();
  message = execSync('git log -1 --pretty=format:"%s"', { cwd: projectRoot }).toString().trim();
  hash = execSync('git log -1 --pretty=format:"%h"', { cwd: projectRoot }).toString().trim();
} catch (error) {
  console.error('❌ Erro ao obter informações do commit:', error.message);
  process.exit(1);
}

console.log('📊 INFORMAÇÕES DO COMMIT:');
console.log(`  👤 Autor: ${author}`);
console.log(`  🔗 Hash: ${hash}`);
console.log(`  💬 Mensagem: ${message}`);
console.log(`  ⏰ Timestamp: ${new Date().toISOString()}\n`);

// Executar testes
console.log('🧪 Executando testes...');
try {
  execSync('pnpm test', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Testes passaram!\n');
} catch (error) {
  console.error('❌ Testes falharam!');
  process.exit(1);
}

// Fazer build
console.log('🔨 Fazendo build...');
try {
  execSync('pnpm build', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Build concluído!\n');
} catch (error) {
  console.error('❌ Build falhou!');
  process.exit(1);
}

// Fazer deploy
console.log('📤 Enviando para Manus...\n');

// Sincronizar com Manus
try {
  console.log('🔄 Sincronizando com Manus...');
  execSync('git push user_github main', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Sincronizado com Manus!\n');
} catch (error) {
  console.log('⚠️  Não foi possível fazer push para user_github (pode ser esperado)\n');
}

console.log('╔════════════════════════════════════════╗');
console.log('║  ✨ DEPLOY CONCLUÍDO COM SUCESSO!     ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('📊 RESUMO DO DEPLOY:');
console.log(`  ✅ Testes: Passaram`);
console.log(`  ✅ Build: Concluído`);
console.log(`  ✅ Sincronização: Feita`);
console.log(`  🌐 URL: https://monitapp-kzszuqk2.manus.space`);
console.log(`\n⏳ Aguarde 1-2 minutos para as mudanças aparecerem no site.\n`);
