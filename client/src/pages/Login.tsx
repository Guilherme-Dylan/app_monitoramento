import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Shield, Mail, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");

  const loginMutation = trpc.auth.loginLocal.useMutation();
  const registerMutation = trpc.auth.registerLocal.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success) {
        toast.success("Login realizado com sucesso!");
        // Redirecionar para home após login
        setTimeout(() => setLocation("/"), 500);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await registerMutation.mutateAsync({ email, password, name });
      if (result.success) {
        toast.success("Cadastro realizado com sucesso! Faça login agora.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Monitoramento</h1>
          </div>
          <p className="text-slate-600">Sistema de Monitoramento Empresarial</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle>{isRegister ? "Criar Conta" : "Fazer Login"}</CardTitle>
            <CardDescription>
              {isRegister
                ? "Crie uma nova conta para acessar o sistema"
                : "Acesse com seu email e senha"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isLoading
                  ? isRegister
                    ? "Criando conta..."
                    : "Fazendo login..."
                  : isRegister
                    ? "Criar Conta"
                    : "Entrar"}
              </Button>
            </form>

            {/* Toggle Register/Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {isRegister ? "Já tem uma conta? " : "Não tem uma conta? "}
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setEmail("");
                    setPassword("");
                    setName("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {isRegister ? "Fazer login" : "Criar conta"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
