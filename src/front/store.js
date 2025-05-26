export const initialStore = () => {
  return {
    message: null,
    contract:"",
    address:"",
    postal_code:"",
    city:"",
    parking_slot:"",
    is_rent:false,
    contract_start_date:"",
    contract_end_date:"",
    firstname:"",
    lastname:"",
    email: "",
    password: "",
    phone:"",
    national_id:"",
    aacc:"",
    token: "",
    visibility: "none",
    visibility2: "",
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
       case "addcontract":
      return {
        ...store,
        contract: action.value,
      };
      case "address":
      return {
        ...store,
        address: action.value,
      };
      case "postal_code":
      return {
        ...store,
        postal_code: action.value,
      };
      case "city":
      return {
        ...store,
        city: action.value,
      };
      case "parking_slot":
      return {
        ...store,
        parking_slot: action.value,
      };
      case "is_rent":
      return {
        ...store,
        is_rent: action.value,
      };
    case "login":
      return {
        ...store,
        visibility: action.value,
      };
    case "register":
      return {
        ...store,
        visibility2: action.value,
      };
    case "validate":
      return {
        ...store,
        validToken: action.value,
      };
    case "addFirtsname":
      return {
        ...store,
        firstname: action.value,
      };
    case "addLastname":
      return {
        ...store,
        lastname: action.value,
      };
    case "addPhone":
      return {
        ...store,
        phone: action.value,
      };
    case "addNid":
      return {
        ...store,
        national_id: action.value,
      };
     case "addAacc":
      return {
        ...store,
        aacc: action.value,
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
      case "addstart_date":
      return {
        ...store,
        contract_start_date: action.value,
      };
      case "addend_date":
      return {
        ...store,
        contract_end_date: action.value,
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
