import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AppHeader } from "@/components/home/AppHeader";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";

export default function AnonymousReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const createMutation = trpc.anonymousReports.create.useMutation({
    onSuccess: () => {
      toast.success("Denúncia enviada com sucesso! Sua identidade está protegida.");
      setFormData({
        title: "",
        description: "",
        category: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar denúncia");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="theme-page min-h-screen">
      <AppHeader isAuthenticated={false} onLogout={async () => {}} />

      <main className="theme-container theme-main">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="theme-hero-title mb-2">Denúncia anônima</h1>
            <p className="theme-hero-subtitle">
              Faça uma denúncia de forma totalmente anônima e segura.
            </p>
          </div>

          <Card className="premium-card premium-card-red">
            <CardHeader>
              <CardTitle>Formulário de denúncia</CardTitle>
              <CardDescription>
                Sua identidade está protegida. Nenhuma informação pessoal será solicitada.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">Denúncia 100% anônima</p>
                    <p className="text-sm text-green-800">
                      Nenhuma informação de identificação é coletada ou armazenada.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title" className="text-[var(--brand-blue-deep)] font-semibold">
                    Título da denúncia *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-2 border-slate-300"
                    placeholder="Resumo breve do assunto"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-[var(--brand-blue-deep)] font-semibold">
                    Categoria (opcional)
                  </Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Assédio">Assédio</option>
                    <option value="Discriminação">Discriminação</option>
                    <option value="Fraude">Fraude</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Violação de Políticas">Violação de políticas</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-[var(--brand-blue-deep)] font-semibold">
                    Descrição detalhada *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="mt-2 border-slate-300 min-h-40"
                    placeholder="Descreva detalhadamente o que você está denunciando (mínimo de 10 caracteres)"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Denúncias falsas ou maliciosas podem gerar consequências legais. Certifique-se de que as informações são precisas.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending}
                  className="btn-premium btn-premium-red w-full"
                >
                  {isSubmitting || createMutation.isPending ? "Enviando..." : "Enviar denúncia"}
                </Button>

                <div className="flex justify-center">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/" className="inline-flex items-center gap-2">
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
