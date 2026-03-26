#!/usr/bin/env node

/**
 * Script de Sincronização Automática com GitHub
 * 
 * Este script sincroniza automaticamente mudanças entre GitHub e Manus:
 * 1. Monitora mudanças no GitHub
 * 2. Sincroniza para Manus automaticamente
 * 3. Faz commit automático quando há mudanças
 * 
 * Uso: node scripts/sync-github.mjs
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    if (!silent) log(result.trim(), 'green');
    return result.trim();
  } catch (error) {
    log(`❌ Erro ao executar: ${command}`, 'red');
    log(error.message, 'red');
    throw error;
  }
}

async function syncFromGitHub() {
  log('\n🔄 Sincronizando do GitHub...', 'cyan');
  
  try {
    // Buscar mudanças do GitHub
    log('📥 Buscando mudanças do GitHub...', 'blue');
    exec('git fetch user_github main', true);
    
    // Verificar se há mudanças
    const status = exec('git status --porcelain', true);
    const diff = exec('git diff user_github/main', true);
    
    if (!diff) {
      log('✓ Já está sincronizado com GitHub', 'green');
      return false;
    }
    
    // Fazer merge das mudanças
    log('🔀 Fazendo merge das mudanças...', 'blue');
    exec('git merge user_github/main --allow-unrelated-histories', true);
    
    log('✅ Sincronizado com sucesso do GitHub!', 'green');
    return true;
  } catch (error) {
    log(`⚠️  Erro ao sincronizar do GitHub: ${error.message}`, 'yellow');
    return false;
  }
}

async function syncToGitHub() {
  log('\n📤 Sincronizando para GitHub...', 'cyan');
  
  try {
    // Verificar se há mudanças não commitadas
    const status = exec('git status --porcelain', true);
    
    if (!status) {
      log('✓ Nenhuma mudança para sincronizar', 'green');
      return false;
    }
    
    log('📝 Encontradas mudanças não commitadas', 'blue');
    
    // Adicionar todas as mudanças
    log('➕ Adicionando mudanças...', 'blue');
    exec('git add .', true);
    
    // Criar commit automático
    const timestamp = new Date().toISOString();
    const commitMessage = `chore: sincronização automática [${timestamp}]`;
    
    log(`💬 Criando commit: "${commitMessage}"`, 'blue');
    exec(`git commit -m "${commitMessage}"`, true);
    
    // Fazer push para GitHub
    log('🚀 Fazendo push para GitHub...', 'blue');
    exec('git push user_github main', true);
    
    log('✅ Sincronizado com sucesso para GitHub!', 'green');
    return true;
  } catch (error) {
    log(`⚠️  Erro ao sincronizar para GitHub: ${error.message}`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n╔════════════════════════════════════════╗', 'cyan');
  log('║  🔄 SINCRONIZAÇÃO AUTOMÁTICA COM GITHUB  ║', 'cyan');
  log('╚════════════════════════════════════════╝', 'cyan');
  
  try {
    // Sincronizar do GitHub
    const changedFromGitHub = await syncFromGitHub();
    
    // Sincronizar para GitHub
    const changedToGitHub = await syncToGitHub();
    
    // Resumo
    log('\n📊 RESUMO DA SINCRONIZAÇÃO:', 'cyan');
    log(`  Do GitHub: ${changedFromGitHub ? '✅ Mudanças sincronizadas' : '✓ Nenhuma mudança'}`, 'blue');
    log(`  Para GitHub: ${changedToGitHub ? '✅ Mudanças sincronizadas' : '✓ Nenhuma mudança'}`, 'blue');
    
    log('\n✨ Sincronização concluída!', 'green');
    
  } catch (error) {
    log('\n❌ Erro durante sincronização:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

main();
