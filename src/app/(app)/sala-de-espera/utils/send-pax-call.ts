import { toast } from "sonner";

export async function sendPaxCall({
  passenger,
}: {
  passenger: { name: string; email: string };
}) {
  const response = await fetch("/api/send-call-pax", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: passenger.email,
      name: passenger.name,
    }),
  });
  const data = await response.json();
  return data;
}
