#!/usr/bin/env node
/**
 * SSH Tunnel Manager for PostgreSQL (Development only)
 * 
 * Checks if a tunnel is already running (e.g., from pgAdmin on port 5432)
 * or creates a new SSH tunnel to access the development database (igek_dev).
 * 
 * Usage:
 *   node scripts/ssh-tunnel.js
 * 
 * Environment variables (from .env or system):
 *   SSH_HOST - SSH host (default: your-server.com)
 *   SSH_USER - SSH user (default: your-user)
 *   SSH_KEY - Path to SSH key (default: ~/.ssh/id_rsa)
 *   LOCAL_PORT - Local port to forward to (default: 5432, can use existing pgAdmin tunnel)
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (one level up from scripts/)
// Use resolve to ensure we get the correct absolute path
const envPath = resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';

// Single SSH tunnel for development database
const sshHost = process.env.SSH_HOST || 'your-server.com';
const sshUser = process.env.SSH_USER || 'your-user';
const sshKey = process.env.SSH_KEY || join(homedir(), '.ssh', 'id_rsa');
const localPort = parseInt(process.env.LOCAL_PORT || '5432', 10); // Default to 5432 (pgAdmin port)
const remotePort = 5432; // PostgreSQL port on remote server
const remoteDb = 'igek_dev';

// Check if port is already in use (e.g., by pgAdmin)
import { execSync } from 'child_process';

function isPortInUse(port) {
  try {
    if (process.platform === 'win32') {
      // Windows: Check if port is in use
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: 'pipe' });
      return result.trim().length > 0;
    } else {
      // Linux/Mac: Check if port is in use
      execSync(`lsof -i :${port}`, { encoding: 'utf-8', stdio: 'pipe' });
      return true;
    }
  } catch {
    return false;
  }
}

const portInUse = isPortInUse(localPort);

if (portInUse) {
  console.log(`\n✅ Port ${localPort} is already in use (likely by pgAdmin or existing tunnel)`);
  console.log(`   You can use this existing tunnel to connect to the database.`);
  console.log(`   Database: ${remoteDb}`);
  console.log(`   Connection: postgresql://user:password@localhost:${localPort}/${remoteDb}\n`);
  console.log(`   If you want to create a new tunnel, stop the existing one first or use a different LOCAL_PORT.\n`);
  process.exit(0);
}

console.log(`\n🔌 Setting up SSH tunnel for development database...`);
console.log(`   Local port: ${localPort}`);
console.log(`   Remote: ${sshUser}@${sshHost}:${remotePort}`);
console.log(`   Database: ${remoteDb}\n`);

// Build SSH command
const sshArgs = [
  '-N', // Don't execute remote command
  '-L', `${localPort}:localhost:${remotePort}`, // Local port forwarding
  `${sshUser}@${sshHost}`
];

if (existsSync(sshKey)) {
  sshArgs.push('-i', sshKey);
}

console.log(`📡 Starting SSH tunnel...`);
console.log(`   Command: ssh ${sshArgs.join(' ')}\n`);
console.log(`✅ Tunnel established!`);
console.log(`   Connect to: postgresql://user:password@localhost:${localPort}/${remoteDb}`);
console.log(`\n   Press Ctrl+C to stop the tunnel\n`);

// Spawn SSH process
const ssh = spawn('ssh', sshArgs, {
  stdio: 'inherit'
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping SSH tunnel...');
  ssh.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  ssh.kill('SIGTERM');
  process.exit(0);
});

ssh.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ SSH tunnel exited with code ${code}`);
    process.exit(code);
  }
});
