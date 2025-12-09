import { CircleAlertIcon, CircleCheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Toast({
  error = false,
  message,
  errorMessage,
  onClick,
  onActionClick,
  action,
  href,
  actionLabel,
}: {
  error?: boolean;
  message: string;
  errorMessage?: string | undefined;
  onClick: () => void;
  onActionClick?: () => void;
  action?: boolean;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto w-fit max-w-[375px] rounded-xl border bg-card px-4 py-3 text-foreground shadow-lg backdrop-blur-md sm:w-(--width)">
      {error ? (
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <CircleAlertIcon
              className="mt-0.5 shrink-0 text-red-500"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow flex-col gap-3">
              <div className="space-y-1">
                <p className="font-medium text-sm">{message}:</p>
                <p className="text-muted-foreground text-sm">{errorMessage}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onClick}>
                  Fechar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Fechar notificação"
              onClick={onClick}
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex grow gap-3">
            <CircleCheckIcon
              className="mt-0.5 shrink-0 text-emerald-500"
              size={16}
              aria-hidden="true"
            />
            <div className="flex grow flex-col gap-3">
              <div className="space-y-1">
                <p className="font-medium text-primary-foreground text-sm">
                  Sucesso:
                </p>
                <p className="text-muted-foreground text-sm">{message}</p>
              </div>
              <div className="flex gap-2">
                {action && (
                  <Button size="sm" onClick={onActionClick}>
                    <Link href={href ?? ""}>{actionLabel}</Link>
                  </Button>
                )}
                <Button size="sm" onClick={onClick}>
                  Fechar
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Fechar notificação"
              onClick={onClick}
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
