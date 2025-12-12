import { cubicBezier } from "motion/react";

export const enterAnimation = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.215, 0.61, 0.355, 1),
      delay: delay,
    },
  }),
};
