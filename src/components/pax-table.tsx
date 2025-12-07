/** biome-ignore-all lint/style/noNonNullAssertion: <because> */
"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { differenceInMinutes } from "date-fns";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Clock12Icon,
  Columns3Icon,
  EllipsisIcon,
  ListFilterIcon,
  MailIcon,
  MessageCircleIcon,
  PlusIcon,
  TrashIcon,
  UserPlusIcon,
  UserRoundX,
} from "lucide-react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import type { infer as ZodInfer, z } from "zod";
import { AddPassengerForm } from "@/app/(app)/sala-de-espera/components/add-passenger-form";
import type { addPassengerSchema } from "@/app/(app)/sala-de-espera/page";
import { handlePassengerUpdate } from "@/app/(app)/sala-de-espera/utils/handle-update-pax";
import { sendPaxCall } from "@/app/(app)/sala-de-espera/utils/send-pax-call";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhone, getPhoneDigits } from "@/lib/phone";
import { cn } from "@/lib/utils";
import Toast from "./toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Kbd, KbdGroup } from "./ui/kbd";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

type Passenger = ZodInfer<typeof addPassengerSchema>;

// Returns the current time, refreshing itself according to the interval.
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date(Date.now())), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

function ChegadaCell({ createdAt }: { createdAt: Date | string }) {
  const now = useNow();
  const createdDate = new Date(createdAt);
  const minutes = Math.max(0, differenceInMinutes(now, createdDate));

  return (
    <span className="text-sm text-muted-foreground">
      {minutes === 0 ? (
        "Chegou agora"
      ) : (
        <span className="flex items-center gap-1">
          <Clock12Icon className="size-4" /> Esperando há {minutes} min
        </span>
      )}
    </span>
  );
}

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Passenger> = (
  row,
  _columnId,
  filterValue,
) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export default function PaxTable({
  data,
  form,
  handleSubmit,
  paxList,
  setPaxList,
}: {
  data: Passenger[];
  form?: UseFormReturn<z.infer<typeof addPassengerSchema>>;
  handleSubmit?: (data: z.infer<typeof addPassengerSchema>) => void;
  paxList: Passenger[];
  setPaxList: Dispatch<SetStateAction<Passenger[]>>;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Passenger>[] = [
    {
      cell: ({ row }) => (
        <Checkbox
          aria-label="Selecionar linha"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Selecionar todas as linhas"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      id: "select",
      size: 28,
    },
    {
      accessorKey: "name",
      header: "Nome",
      filterFn: multiColumnFilterFn,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-primary-foreground">
            {row.original.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.email ?? formatPhone(row.original.phone)}
          </span>
        </div>
      ),
    },
    {
      id: "guests",
      header: "Acompanhantes",
      cell: ({ row }) => {
        const total = row.original.guests ?? 0;
        return (
          <Badge variant="outline" className="text-primary-foreground">
            {total > 0 ? (
              <p>
                <span className="text-primary">{total}</span> acompanhante{total > 1 ? "s" : ""}
              </p>
            ) : (
              "Nenhum acompanhante"
            )}
          </Badge>
        );
      },
    },
    {
      id: "arrivedAt",
      header: "Espera",
      cell: ({ row }) => <ChegadaCell createdAt={row.original.createdAt} />,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="border-yellow-400/70">
            {" "}
            <div className="size-1.5 bg-yellow-400/70 rounded-full me-1" />{" "}
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "contact",
      header: "Contato",
      cell: ({ row }) => (
        <ContactDialog
          passenger={row.original}
          paxList={paxList}
          setPaxList={setPaxList}
        />
      ),
    },
    {
      cell: ({ row }) => <RowActions row={row} />,
      enableHiding: false,
      header: () => <span className="sr-only">Ações</span>,
      id: "actions",
      size: 60,
    },
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
  });

  // const fromItem =
  //   table.getRowCount() === 0
  //     ? 0
  //     : table.getState().pagination.pageIndex *
  //         table.getState().pagination.pageSize +
  //       1;
  // const toItem =
  //   table.getRowCount() === 0
  //     ? 0
  //     : Math.min(
  //         (table.getState().pagination.pageIndex + 1) *
  //           table.getState().pagination.pageSize,
  //         table.getRowCount(),
  //       );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by name or email */}
          <div className="relative">
            <Input
              aria-label="Filtrar por nome ou email"
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
              )}
              id={`${id}-input`}
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              placeholder="Filtrar por nome ou email..."
              ref={inputRef}
              type="text"
              value={
                (table.getColumn("name")?.getFilterValue() ?? "") as string
              }
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilterIcon aria-hidden="true" size={16} />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  table.getColumn("name")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                type="button"
              >
                <CircleXIcon aria-hidden="true" size={16} />
              </button>
            )}
          </div>
          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  aria-hidden="true"
                  className="-ms-1 opacity-60"
                  size={16}
                />
                Visualizar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-card backdrop-blur-md"
              align="end"
            >
              <DropdownMenuLabel>Alternar colunas</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      checked={column.getIsVisible()}
                      className="capitalize"
                      key={column.id}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {(column.columnDef.header as string) ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    aria-hidden="true"
                    className="-ms-1 opacity-60"
                    size={16}
                  />
                  Deletar
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card backdrop-blur-md">
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja deletar?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Esta ação irá deletar
                      permanentemente {table.getSelectedRowModel().rows.length}{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "linha"
                        : "linhas"}{" "}
                      selecionada
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {}}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add user button */}
          <AddPaxDialog form={form!} handleSubmit={handleSubmit!} />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className="bg-card backdrop-brightness-50">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="hover:bg-sidebar-accent/70"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="h-11 text-primary-foreground"
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className={cn(
                            "flex h-full w-full items-center justify-between gap-2 text-left",
                            "cursor-pointer select-none",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                aria-hidden="true"
                                className="shrink-0 opacity-60"
                                size={16}
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="shrink-0 opacity-60"
                                size={16}
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDownIcon
                              aria-hidden="true"
                              className="shrink-0 opacity-60"
                              size={16}
                            />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                  className="hover:bg-sidebar-accent/70"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="last:py-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-fit text-center"
                  colSpan={columns.length}
                >
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <UserRoundX className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>Nenhum passageiro</EmptyTitle>
                      <EmptyDescription>
                        Nenhum passageiro encontrado. Adicione um passageiro
                        para a lista de espera.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex justify-center">
                      <div>
                        <AddPaxDialog
                          form={form!}
                          handleSubmit={handleSubmit!}
                        />
                      </div>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label className="max-sm:sr-only" htmlFor={id}>
            Linhas por página
          </Label>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-fit whitespace-nowrap" id={id}>
              <SelectValue placeholder="Selecione o número de resultados" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-sm">
          <p
            aria-live="polite"
            className="whitespace-nowrap text-muted-foreground text-sm"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{" "}
            de{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  aria-label="Ir para a primeira página"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.firstPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronFirstIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  aria-label="Ir para a página anterior"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronLeftIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  aria-label="Ir para a próxima página"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronRightIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  aria-label="Ir para a última página"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.lastPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronLastIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function AddPaxDialog({
  form,
  handleSubmit,
}: {
  form: UseFormReturn<z.infer<typeof addPassengerSchema>>;
  handleSubmit: (data: z.infer<typeof addPassengerSchema>) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto" variant="default">
          <PlusIcon aria-hidden="true" className="-ms-1" size={16} />
          Adicionar pax
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/60 backdrop-blur-sm p-0 w-max">
        <DialogHeader className="hidden">
          <DialogTitle className="sr-only">Adicionar passageiro</DialogTitle>
          <DialogDescription className="sr-only">
            Adicione um passageiro para a lista de espera.
          </DialogDescription>
        </DialogHeader>
        {form && handleSubmit && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center text-lg font-medium">
                <UserPlusIcon className="size-5" />
                Adicionar passageiro
              </CardTitle>
              <CardDescription className="text-center">
                Adicione um passageiro para a lista de espera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddPassengerForm form={form} handleSubmit={handleSubmit} />
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RowActions({ row: _row }: { row: Row<Passenger> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            aria-label="Editar item"
            className="shadow-none"
            size="icon"
            variant="ghost"
          >
            <EllipsisIcon aria-hidden="true" size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card backdrop-blur-md" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Editar</span>
            <DropdownMenuShortcut>
              <KbdGroup>
                <Kbd>ctrl</Kbd>
                <Kbd>E</Kbd>
              </KbdGroup>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicar</span>
            <DropdownMenuShortcut>
              <KbdGroup>
                <Kbd>ctrl</Kbd>
                <Kbd>D</Kbd>
              </KbdGroup>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Deletar</span>
          <DropdownMenuShortcut>
            <KbdGroup>
              <Kbd>ctrl</Kbd>
              <Kbd>⌫</Kbd>
            </KbdGroup>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ContactDialog({
  passenger,
  message,
  paxList,
  setPaxList,
}: {
  passenger: Passenger;
  message?: string;
  paxList?: Passenger[];
  setPaxList?: Dispatch<SetStateAction<Passenger[]>>;
}) {
  const hasEmail = Boolean(passenger.email);
  const phoneDigits = getPhoneDigits(passenger.phone);
  const hasPhone = phoneDigits.length >= 10;

  const wave = "\u{1F44B}"; // 👋
  const bell = "\u{1F514}"; // 🔔
  const pin = "\u{1F4CD}"; // 📍
  const warn = "\u26A0\uFE0F"; // ⚠️
  const check = "\u2705"; // ✅
  const thanks = "\u{1F64F}"; // 🙏

  const namePart = passenger.name ? ` ${passenger.name}` : "";
  const messagePart = `${wave} Olá${namePart}!

${bell} *Chamada para Sala VIP*
${pin} Por favor, dirija-se à recepção e informe seu nome em até *15 minutos* a partir deste chamado.

${warn} Caso não se apresente em até 15 minutos, sua vaga será disponibilizada para outro passageiro.

${check} Se puder comparecer, responda: *Confirmo*

${thanks} Obrigado!
- Ambaar Lounge`;

  const encoded = encodeURIComponent(messagePart);

  const [isPending, startTransition] = useTransition();

  const actions = [
    hasEmail
      ? {
          type: "email",
          label: `Enviar email (${passenger.email})`,
          href: `mailto:${passenger.email}`,
          Icon: MailIcon,
        }
      : null,
    hasPhone
      ? {
          type: "phone",
          label: `WhatsApp (${formatPhone(phoneDigits)})`,
          href: `https://wa.me/${phoneDigits}?text=${encoded}`,
          Icon: MessageCircleIcon,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: typeof MailIcon;
    type: "email" | "phone";
  }[];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {message ?? "Chamar pax"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card backdrop-blur-xs w-sm">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">
            Chamar {passenger.name}
          </DialogTitle>
          <DialogDescription>
            Escolha uma forma de contato disponível para o passageiro.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {actions.length ? (
            actions.map(({ label, href, Icon, type }) => (
              <Button
                key={label}
                asChild
                variant="secondary"
                onClick={async () => {
                  if (type === "email") {
                    try {
                      startTransition(async () => {
                        await sendPaxCall({
                          passenger: {
                            email: passenger.email!,
                            name: passenger.name,
                          },
                        });
                      });
                      toast.custom((t) => (
                        <Toast
                          onClick={() => toast.dismiss(t)}
                          message="Chamada enviada com sucesso"
                        />
                      ));
                      await handlePassengerUpdate(
                        {
                          ...passenger,
                          status: "Chamado",
                        },
                        paxList ?? [],
                        setPaxList ??
                          (() => {
                            return [];
                          }),
                      );
                    } catch (error) {
                      console.error("Error sending pax call:", error);
                      toast.error("Erro ao enviar chamada.");
                    }
                  }
                }}
                className="cursor-default"
                disabled={isPending}
              >
                {type === "phone" ? (
                  <a href={href} rel="noreferrer" target="_blank">
                    <Icon className="mr-2 size-4" />
                    {label}
                  </a>
                ) : (
                  <div>
                    <Icon className="mr-2 size-4" />
                    {isPending ? <Spinner /> : label}
                  </div>
                )}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum canal de contato disponível.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
