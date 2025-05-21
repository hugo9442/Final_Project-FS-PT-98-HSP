export const initialStore = () => {
  return {
    message: null,
    email: "",
    password: "",
    token: "",
    validToken: false,
    todos: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
      case "validate":
      return {
        ...store,
        validToken: action.value,
      };
    case "addEmail":
      return {
        ...store,
        email: action.value,
      };
    case "addPassword":
      return {
        ...store,
        password: action.value,
      };
    case "addToken":
      return {
        ...store,
        token: action.value,
      };
    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    case "add_user":
      const userExists = store.todos.some((u) => u.id === action.value.id);
      if (userExists) return store; 

      return {
        ...store,
        todos: [...store.todos, action.value],
      };
    default:
      throw Error("Unknown action.");
  }
}
