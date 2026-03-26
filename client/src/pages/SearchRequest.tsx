import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/home/AppHeader";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SearchRequest() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.nome || "",
    email: user?.email || "",
    phone: "",
    department: "",
    position: "",
    description: "",
  });

  const createMutation = trpc.searchRequests.create.useMutation({
    onSuccess: () => {
      toast.success("Solicitação enviada com sucesso!");
      setFormData({
        name: user?.nome || "",
        email: user?.email || "",
        phone: "",
        department: "",
        position: "",
        description: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar solicitação");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        department: formData.department,
        position: formData.position || undefined,
        description: formData.description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={isAuthenticated} userName={user?.nome} onLogout={logout} />

      <main className="theme-container theme-main">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="theme-hero-title mb-2">Solicitação de busca</h1>
            <p className="theme-hero-subtitle">
              Preencha os dados abaixo para registrar uma solicitação com segurança.
            </p>
          </div>

          <Card className="premium-card premium-card-blue">
            <CardHeader>
              <CardTitle>Formulário de solicitação</CardTitle>
              <CardDescription>
                Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <Label htmlFor="name" className="text-slate-700 font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 border-slate-300"
                  placeholder="Digite seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 border-slate-300"
                  placeholder="seu.email@empresa.com"
                />
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2 border-slate-300"
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Setor */}
              <div>
                <Label htmlFor="department" className="text-slate-700 font-medium">
                  Setor de Trabalho *
                </Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="mt-2 border-slate-300"
                  placeholder="Ex: Recursos Humanos, TI, Financeiro"
                />
              </div>

              {/* Cargo */}
              <div>
                <Label htmlFor="position" className="text-slate-700 font-medium">
                  Cargo
                </Label>
                <Input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-2 border-slate-300"
                  placeholder="Ex: Gerente, Analista"
                />
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Descrição da Solicitação *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-2 border-slate-300 min-h-32"
                  placeholder="Descreva detalhadamente sua solicitação (mínimo 10 caracteres)"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Sua solicitação será analisada pela equipe de monitoramento. Você receberá uma resposta em breve.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
                className="btn-premium btn-premium-blue w-full"
              >
                {isSubmitting || createMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
              </Button>

              <div className="flex justify-center">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/menu" className="inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao menu
                  </Link>
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
