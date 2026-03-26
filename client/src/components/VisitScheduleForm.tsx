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
    onError: error => {
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
    <Card className="theme-surface-card bg-white/95">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--brand-blue)]" />
          Agendar visita
        </CardTitle>
        <CardDescription>
          Escolha a data e hora para a visita de monitoramento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`visit-date-${requestId}`}>Data da visita</Label>
            <Input
              id={`visit-date-${requestId}`}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`visit-time-${requestId}`} className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário
            </Label>
            <Input
              id={`visit-time-${requestId}`}
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`visit-reason-${requestId}`} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Motivo da visita (opcional)
            </Label>
            <Textarea
              id={`visit-reason-${requestId}`}
              placeholder="Descreva o motivo ou objetivo da visita..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full min-h-24 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="btn-premium btn-premium-blue w-full"
          >
            {isLoading ? "Agendando..." : "Agendar visita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

