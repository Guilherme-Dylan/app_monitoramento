import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, Clock, FileText } from "lucide-react";

interface VisitScheduleFormProps {
  requestId: number;
  onSuccess?: () => void;
}

export function VisitScheduleForm({ requestId, onSuccess }: VisitScheduleFormProps) {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("09:00");
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createVisit = trpc.visits.create.useMutation({
    onSuccess: () => {
      toast.success("Visita agendada com sucesso!");
      setDate("");
      setTime("09:00");
      setReason("");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao agendar visita");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Selecione uma data");
      return;
    }

    setIsLoading(true);
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      await createVisit.mutateAsync({
        requestId,
        scheduledDate,
        reason: reason || undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Agendar Visita
        </CardTitle>
        <CardDescription>
          Escolha a data e hora para a visita de monitoramento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data da Visita</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Hora */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Motivo da Visita (Opcional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo ou objetivo da visita..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-24 resize-none"
            />
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? "Agendando..." : "Agendar Visita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
