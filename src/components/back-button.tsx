import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function BackButton({ href }: { href: string }) {
  return (
    <Button variant="secondary" asChild>
      <Link href={href}>
        <ArrowLeftIcon className="size-4" />
        Voltar
      </Link>
    </Button>
  );
}
