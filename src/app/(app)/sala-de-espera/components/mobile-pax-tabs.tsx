"use client";

import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Passenger } from "../page";
import {
  mobilePaxMenuAnimation,
  paxContainerAnimation,
  paxContainerContentAnimation,
} from "./anime";
import { CalledPax } from "./called-pax";
import { NotArrivedPax } from "./not-arrived-pax";

export function MobilePaxTabs({
  calledPaxList,
  notArrivedPaxList,
  paxList,
  setPaxList,
}: {
  calledPaxList: Passenger[];
  notArrivedPaxList: Passenger[];
  paxList: Passenger[];
  setPaxList: Dispatch<SetStateAction<Passenger[]>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalledOpen, setIsCalledOpen] = useState(false);
  const [isNotArrivedOpen, setIsNotArrivedOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeTabs = useCallback(() => {
    setIsOpen(false);
    setIsCalledOpen(false);
    setIsNotArrivedOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeTabs();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeTabs, isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed right-1/2 bottom-4 z-50 translate-x-1/2 cursor-default rounded-3xl border border-input/50 bg-card p-2 backdrop-blur-sm"
    >
      {isOpen && (
        <div className="flex w-full justify-end">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={closeTabs}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}
      <motion.div
        variants={mobilePaxMenuAnimation}
        initial="initial"
        animate={isOpen ? "animate" : "initial"}
        className="flex flex-col justify-center gap-2"
      >
        <motion.div
          variants={paxContainerAnimation}
          initial="initial"
          animate={
            isOpen && isCalledOpen
              ? "animate"
              : isOpen && !isCalledOpen
                ? "idle"
                : "initial"
          }
          className="relative overflow-hidden p-4 backdrop-brightness-70 hover:text-primary-foreground"
          onClick={() => {
            if (isOpen && isCalledOpen) return;
            setIsOpen(true);
            setIsCalledOpen(true);
            setIsNotArrivedOpen(false);
          }}
        >
          <motion.div
            variants={paxContainerContentAnimation}
            initial="initial"
            animate={isOpen && isCalledOpen ? "animate" : "show"}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500/70" />
              <span className="font-medium text-sm transition-colors duration-200">
                Chamados
              </span>
            </div>
            <Badge>{calledPaxList.length}</Badge>
          </motion.div>
          <div
            className={cn(
              "scrollbar-hide absolute inset-0 overflow-y-auto p-4 text-primary-foreground transition-opacity duration-200",
              isOpen && isCalledOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <CalledPax calledPaxList={calledPaxList} setPaxList={setPaxList} />
          </div>
        </motion.div>
        <motion.div
          variants={paxContainerAnimation}
          initial="initial"
          animate={
            isOpen && isNotArrivedOpen
              ? "animate"
              : isOpen && !isNotArrivedOpen
                ? "idle"
                : "initial"
          }
          className="overflow-hidden p-4 backdrop-brightness-70 hover:text-primary-foreground"
          onClick={() => {
            if (isOpen && isNotArrivedOpen) return;
            setIsOpen(true);
            setIsNotArrivedOpen(true);
            setIsCalledOpen(false);
          }}
        >
          <motion.div
            variants={paxContainerContentAnimation}
            initial="initial"
            animate={isOpen && isNotArrivedOpen ? "animate" : "show"}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-red-500/70" />
              <span className="text-nowrap font-medium text-sm transition-colors duration-200">
                Não compareceram
              </span>
            </div>
            <Badge>{notArrivedPaxList.length}</Badge>
          </motion.div>
          <div
            className={cn(
              "scrollbar-hide absolute inset-0 overflow-y-auto p-4 text-primary-foreground transition-opacity duration-200",
              isOpen && isNotArrivedOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <NotArrivedPax
              notArrivedPaxList={notArrivedPaxList}
              paxList={paxList}
              setPaxList={setPaxList}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
