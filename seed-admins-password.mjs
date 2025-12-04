import mysql from "mysql2/promise";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedAdminsWithPassword() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Gerar hashes de senha
    const password1 = "Admin@123456";
    const password2 = "Admin@654321";

    const hashedPassword1 = await bcryptjs.hash(password1, 10);
    const hashedPassword2 = await bcryptjs.hash(password2, 10);

    // Criar dois usuários administradores
    const admin1 = {
      openId: `local-admin-1-${Date.now()}`,
      name: "Administrador Principal",
      email: "admin1@monitoramento.com",
      password: hashedPassword1,
      loginMethod: "email",
      role: "admin",
      lastSignedIn: new Date(),
    };

    const admin2 = {
      openId: `local-admin-2-${Date.now()}`,
      name: "Administrador Secundário",
      email: "admin2@monitoramento.com",
      password: hashedPassword2,
      loginMethod: "email",
      role: "admin",
      lastSignedIn: new Date(),
    };

    // Deletar usuários existentes com esses emails (se houver)
    await connection.execute("DELETE FROM users WHERE email = ?", [admin1.email]);
    await connection.execute("DELETE FROM users WHERE email = ?", [admin2.email]);

    // Inserir admin 1
    await connection.execute(
      "INSERT INTO users (openId, name, email, password, loginMethod, role, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        admin1.openId,
        admin1.name,
        admin1.email,
        admin1.password,
        admin1.loginMethod,
        admin1.role,
        admin1.lastSignedIn,
      ]
    );

    // Inserir admin 2
    await connection.execute(
      "INSERT INTO users (openId, name, email, password, loginMethod, role, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        admin2.openId,
        admin2.name,
        admin2.email,
        admin2.password,
        admin2.loginMethod,
        admin2.role,
        admin2.lastSignedIn,
      ]
    );

    console.log("\n✅ Dois usuários administradores criados com sucesso!\n");
    console.log("=" + "=".repeat(70));
    console.log("CREDENCIAIS DE ACESSO DOS ADMINISTRADORES");
    console.log("=" + "=".repeat(70));
    console.log("\n📌 ADMINISTRADOR 1:");
    console.log(`   Nome: ${admin1.name}`);
    console.log(`   Email: ${admin1.email}`);
    console.log(`   Senha: ${password1}`);
    console.log(`   Role: ${admin1.role}`);

    console.log("\n📌 ADMINISTRADOR 2:");
    console.log(`   Nome: ${admin2.name}`);
    console.log(`   Email: ${admin2.email}`);
    console.log(`   Senha: ${password2}`);
    console.log(`   Role: ${admin2.role}`);

    console.log("\n" + "=".repeat(71));
    console.log("🔐 COMO FAZER LOGIN:");
    console.log("=".repeat(71));
    console.log("1. Acesse a aplicação");
    console.log("2. Clique em 'Entrar'");
    console.log("3. Use o email e senha fornecidos acima");
    console.log("4. Você terá acesso completo ao painel administrativo\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar administradores:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAdminsWithPassword();
