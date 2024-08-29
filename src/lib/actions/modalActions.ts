export const modalOpen = (modalData: any) => ({
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
