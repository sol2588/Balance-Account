interface ModalProps {
  isOpen: boolean;
  title: string;
}

interface ModalAction {
  type: string;
  payload: {
    title?: string;
    isOpen: boolean;
  };
}

const initialState: ModalProps = {
  isOpen: false,
  title: "",
};

export default function modalReducer(state = initialState, action: ModalAction): ModalProps {
  switch (action.type) {
    case "IS_OPEN":
      return {
        ...state,
        isOpen: action.payload.isOpen || true,
        title: action.payload.title || "",
      };
    case "IS_CLOSE":
      return {
        ...state,
        isOpen: action.payload.isOpen || false,
        title: "",
      };
    default:
      return state;
  }
}
