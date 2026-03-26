import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

type AckMap = Record<string, string>;

const readAckMap = (key: string): AckMap => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as AckMap) : {};
  } catch {
    return {};
  }
};

const writeAckMap = (key: string, value: AckMap) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readLastSeen = (key: string): number => {
  const raw = localStorage.getItem(key);
  if (!raw) return 0;
  const num = Number(raw);
  return Number.isFinite(num) ? num : 0;
};

const writeLastSeen = (key: string, value: number) => {
  localStorage.setItem(key, String(value));
};

export function RealtimeNotifications() {
  const { user, isAuthenticated, loading } = useAuth();

  const isAdmin = user?.tipo_de_user === "admin";
  const userId = user?.id ?? null;

  const { data: adminRequests } = trpc.searchRequests.getAllRequests.useQuery(undefined, {
    enabled: isAuthenticated && isAdmin && !loading,
    refetchInterval: 6000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { data: adminReports } = trpc.anonymousReports.getAllReports.useQuery(undefined, {
    enabled: isAuthenticated && isAdmin && !loading,
    refetchInterval: 6000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { data: userRequests } = trpc.searchRequests.getUserRequests.useQuery(undefined, {
    enabled: isAuthenticated && !isAdmin && !loading,
    refetchInterval: 6000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const newestAdminRequestTs = useMemo(() => {
    if (!adminRequests?.length) return 0;
    return Math.max(...adminRequests.map(r => new Date(r.createdAt).getTime()));
  }, [adminRequests]);

  const newestAdminReportTs = useMemo(() => {
    if (!adminReports?.length) return 0;
    return Math.max(...adminReports.map(r => new Date(r.createdAt).getTime()));
  }, [adminReports]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !adminRequests) return;

    const key = "notif_admin_last_seen_request_created_at";
    const lastSeen = readLastSeen(key);

    if (lastSeen === 0) {
      writeLastSeen(key, newestAdminRequestTs);
      return;
    }

    const news = adminRequests.filter(r => new Date(r.createdAt).getTime() > lastSeen);
    if (news.length > 0) {
      toast.info(
        news.length === 1
          ? "Nova solicitação recebida."
          : `${news.length} novas solicitações recebidas.`
      );
      writeLastSeen(key, newestAdminRequestTs);
    }
  }, [isAuthenticated, isAdmin, adminRequests, newestAdminRequestTs]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin || !adminReports) return;

    const key = "notif_admin_last_seen_report_created_at";
    const lastSeen = readLastSeen(key);

    if (lastSeen === 0) {
      writeLastSeen(key, newestAdminReportTs);
      return;
    }

    const news = adminReports.filter(r => new Date(r.createdAt).getTime() > lastSeen);
    if (news.length > 0) {
      toast.info(
        news.length === 1
          ? "Nova denúncia anônima recebida."
          : `${news.length} novas denúncias anônimas recebidas.`
      );
      writeLastSeen(key, newestAdminReportTs);
    }
  }, [isAuthenticated, isAdmin, adminReports, newestAdminReportTs]);

  useEffect(() => {
    if (!isAuthenticated || isAdmin || !userId || !userRequests) return;

    const ackKey = `notif_user_request_status_ack_${userId}`;
    const ack = readAckMap(ackKey);

    if (Object.keys(ack).length === 0) {
      const seed: AckMap = {};
      for (const req of userRequests) {
        seed[String(req.id)] = `${req.status}:${new Date(req.updatedAt).getTime()}`;
      }
      writeAckMap(ackKey, seed);
      return;
    }

    let hasUpdates = false;
    const nextAck = { ...ack };

    for (const req of userRequests) {
      const signature = `${req.status}:${new Date(req.updatedAt).getTime()}`;
      const idKey = String(req.id);

      if (nextAck[idKey] === signature) continue;

      nextAck[idKey] = signature;
      hasUpdates = true;

      if (req.status === "approved") {
        toast.success(`Sua solicitação #${req.id} foi aprovada.`);
      } else if (req.status === "rejected") {
        toast.error(`Sua solicitação #${req.id} foi rejeitada.`);
      } else if (req.status === "pending") {
        toast.info(`Sua solicitação #${req.id} voltou para pendente.`);
      }
    }

    if (hasUpdates) {
      writeAckMap(ackKey, nextAck);
    }
  }, [isAuthenticated, isAdmin, userId, userRequests]);

  return null;
}

