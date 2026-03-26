import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Denúncia Anônima</h1>
          <p className="text-slate-600">Faça uma denúncia de forma totalmente anônima e segura</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Formulário de Denúncia</CardTitle>
            <CardDescription>
              Sua identidade está completamente protegida. Nenhuma informação pessoal será solicitada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Segurança */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">Denúncia 100% Anônima</p>
                  <p className="text-sm text-green-800">
                    Nenhuma informação de identificação é coletada ou armazenada.
                  </p>
                </div>
              </div>

              {/* Título */}
              <div>
                <Label htmlFor="title" className="text-slate-700 font-medium">
                  Título da Denúncia *
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

              {/* Categoria */}
              <div>
                <Label htmlFor="category" className="text-slate-700 font-medium">
                  Categoria (Opcional)
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
                  <option value="Violação de Políticas">Violação de Políticas</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Descrição Detalhada *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-2 border-slate-300 min-h-40"
                  placeholder="Descreva detalhadamente o que você está denunciando (mínimo 10 caracteres)"
                />
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Denúncias falsas ou maliciosas podem resultar em consequências legais. Certifique-se de que suas informações são precisas.
                </p>
              </div>

              {/* Botão Submit */}
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
              >
                {isSubmitting || createMutation.isPending ? "Enviando..." : "Enviar Denúncia"}
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
    </div>
  );
}
