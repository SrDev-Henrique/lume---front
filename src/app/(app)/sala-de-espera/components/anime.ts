export const mobilePaxMenuAnimation = {
  initial: {
    height: "8.2rem",
    width: "12.7rem",
    transition: {
      duration: 0.4,
      height: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
      width: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
    },
  },
  animate: {
    height: "24rem",
    width: "24rem",
    transition: {
      duration: 0.4,
      height: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
      width: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
    },
  },
};

export const paxContainerAnimation = {
  initial: {
    height: "3.3rem",
    borderRadius: "5rem",
    transition: {
      duration: 0.4,
      borderRadius: { duration: 0.2 },
    },
  },
  animate: {
    height: "19.3rem",
    borderRadius: "2rem",
    transition: {
      duration: 0.4,
      borderRadius: { duration: 0.2 },
    },
  },
  idle: {
    height: "3.3rem",
    borderRadius: "5rem",
    transition: {
      duration: 0.4,
      borderRadius: { duration: 0.2 },
    },
  },
};

export const paxContainerContentAnimation = {
  initial: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
  animate: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.4,
    },
  },
};
