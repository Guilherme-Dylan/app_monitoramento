import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

async function seedAdmins() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Criar dois usuários administradores
    const admin1OpenId = nanoid();
    const admin2OpenId = nanoid();

    const admin1 = {
      openId: admin1OpenId,
      name: "Administrador Principal",
      email: "admin1@monitoramento.com",
      loginMethod: "manual",
      role: "admin",
      lastSignedIn: new Date(),
    };

    const admin2 = {
      openId: admin2OpenId,
      name: "Administrador Secundário",
      email: "admin2@monitoramento.com",
      loginMethod: "manual",
      role: "admin",
      lastSignedIn: new Date(),
    };

    // Inserir admin 1
    await connection.execute(
      "INSERT INTO users (openId, name, email, loginMethod, role, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?)",
      [
        admin1.openId,
        admin1.name,
        admin1.email,
        admin1.loginMethod,
        admin1.role,
        admin1.lastSignedIn,
      ]
    );

    // Inserir admin 2
    await connection.execute(
      "INSERT INTO users (openId, name, email, loginMethod, role, lastSignedIn) VALUES (?, ?, ?, ?, ?, ?)",
      [
        admin2.openId,
        admin2.name,
        admin2.email,
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
    console.log(`   OpenID: ${admin1.openId}`);
    console.log(`   Role: ${admin1.role}`);

    console.log("\n📌 ADMINISTRADOR 2:");
    console.log(`   Nome: ${admin2.name}`);
    console.log(`   Email: ${admin2.email}`);
    console.log(`   OpenID: ${admin2.openId}`);
    console.log(`   Role: ${admin2.role}`);

    console.log("\n" + "=".repeat(71));
    console.log("⚠️  IMPORTANTE:");
    console.log("=".repeat(71));
    console.log("Os usuários foram criados no banco de dados com OpenIDs únicos.");
    console.log("Para fazer login no aplicativo, use o botão 'Entrar' que redireciona");
    console.log("para o Manus OAuth. Os usuários serão automaticamente sincronizados");
    console.log("com base no seu openId do Manus.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar administradores:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedAdmins();
