interface ModalProps {
  isOpen: boolean;
  title: string;
}

const initialState: ModalProps = {
  isOpen: false,
  title: "",
};

export default function modalReducer(state = initialState, action: any): ModalProps {
  switch (action.type) {
    case "IS_OPEN":
      return {
        ...state,
        isOpen: true,
        title: action.payload.title,
      };
    case "IS_CLOSE":
      return {
        ...state,
        isOpen: false,
      };
    default:
      return { ...state };
  }
}
