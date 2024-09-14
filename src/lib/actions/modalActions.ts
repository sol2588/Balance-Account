export const modalOpen = (modalData: Record<string, string>) => ({
  type: "IS_OPEN",
  payload: {
    isOpen: true,
    title: modalData.title,
  },
});

export const modalClose = () => ({
  type: "IS_CLOSE",
  payload: {
    isOpen: false,
  },
});
