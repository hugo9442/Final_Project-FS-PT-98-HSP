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
    token: localStorage.getItem("jwt-token") || "",
    visibility: "none",
    visibility2: "block",
    validToken: false,
    todos: [],
    tenant:[],
    contracts:[],
    forgotPasswordVisibility: "none",
    resetPasswordVisibility: "none"
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
        visibility2: action.value,
        visibility: "none",
        forgotPasswordVisibility: "none",
        resetPasswordVisibility: "none",
        resetMessage: null,
        resetToken: null,
      };
    case "register":
      return {
        ...store,
        visibility: action.value,
        visibility2: "none",
        forgotPasswordVisibility: "none",
        resetPasswordVisibility: "none",
        resetMessage: null,
        resetToken: null,
      };
    case "showForgotPassword":
      return {
        ...store,
        forgotPasswordVisibility: "block",
        visibility: "none",
        visibility2: "none",
        resetPasswordVisibility: "none",
        resetMessage: null,
        resetToken: null,
      };
    case "showResetPassword":
      return {
        ...store,
        resetPasswordVisibility: "block",
        visibility: "none",
        visibility2: "none",
        forgotPasswordVisibility: "none",
      };
    case "setResetToken":
      return {
        ...store,
        resetToken: action.value,
      };
    case "addToken":
      localStorage.setItem("jwt-token", action.value);
      return {
        ...store,
        token: action.value,
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
      case "add_contracts":
       //const allContracts = store.contracts.flat();
       const contractsExits = store.contracts.some(u => u.id === action.value.id);
      if (contractsExits) return store; 
     
       
      return {
        ...store,
        contracts: [...store.contracts, action.value],
      };
       case "add_tenant":
      const tenantExists = store.tenant.some((u) => u.id === action.value.id);
      if (tenantExists) return store; 

      return {
        ...store,
        tenant: [...store.tenant, action.value],
      };
    default:
      throw Error("Unknown action.");
  }
}
