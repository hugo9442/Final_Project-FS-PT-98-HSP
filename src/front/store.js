import { apartments } from "./fecht_apartment";
import { expenses } from "./fecht_expenses";



export const initialStore = () => {
  return {
    message: null,
    title:"",
    rol:"",
    type:"",
    description:"",
    status:"",
    contract: "",
    address: "",
    postal_code: "",
    city: "",
    parking_slot: "",
    is_rent: false,
    contract_start_date: "",
    contract_end_date: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    national_id: "",
    aacc: "",
    token: "",
    vista:"none",
    vista2:"",
    visibility: "none",
    visibility2: "block",
    validToken: false,
    expenses:[],
    contractorexpenses:[],
    todos: [],
    contractor:[],
    user:[],
    apartments: [],
    apartmentwithdocuments:[],
    asociation: [],
    tenant: [],
    contracts: [],
    invoices:[],
    issues: [],
    singleIssues:[],
    AssocByApertmentId:[],
    assocnoapartments:[],
    forgotPasswordVisibility: "none",
    resetPasswordVisibility: "none",
    tenantSetPasswordVisibility: "none",
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "add_expenses":
      return {
        ...store,
        expenses: action.value,
      };
       case "add_singleIssues":
      return {
        ...store,
        singleIssues: action.value,
      };
       case "add_contractor_expenses":
      return {
        ...store,
        contractorexpenses: action.value,
      };
      case "addrol":
      return {
        ...store,
        rol: action.value,
      };
      case "add_contractor":
      return {
        ...store,
        contractor: action.value,
      };
       case "add_assocnoapartments":
      return {
        ...store,
        assocnoapartments: action.value,
      };
      case "add_apartmentswhitdocuments":
      return {
        ...store,
        apartmentwithdocuments: action.value,
      };
      case "add_invoices":
      return {
        ...store,
        invoices: action.value,
      };
     case "add_owner":
      return {
        ...store,
        user: action.value,
      };
    case "addcontract":
      return {
        ...store,
        contract: action.value,
      };
       case "addAssocByApertmentId":
      return {
        ...store,
        AssocByApertmentId: action.value,
      };
    case "address":
      return {
        ...store,
        address: action.value,
      };
       case "addtype":
      return {
        ...store,
        type: action.value,
      };
      case "addstatus":
      return {
        ...store,
        status: action.value,
      };
       case "adddescription":
      return {
        ...store,
        description: action.value,
      };
       case "vista":
      return {
        ...store,
        vista: action.value,
      };
       case "vista2":
      return {
        ...store,
        vista2: action.value,
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
        tenantSetPasswordVisibility: "none",
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
        tenantSetPasswordVisibility: "none",
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
        tenantSetPasswordVisibility: "none",
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
        tenantSetPasswordVisibility: "none",
      };
    case "setResetToken":
      return {
        ...store,
        resetToken: action.value,
      };
    case "showTenantSetPassword":
      return {
        ...store,
        tenantSetPasswordVisibility: "block",
        visibility: "none",
        visibility2: "none",
        forgotPasswordVisibility: "none",
        resetPasswordVisibility: "none",
        resetMessage: null,
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
       case "addTitle":
      return {
        ...store,
        title: action.value,
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
    case "Aaccadd":
      return {
        ...store,
        aacc: action.value,
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
    
    case "add_user":
      return {
        ...store,
        todos: action.value,
      };
      case "add_issues":
      return {
        ...store,
        issues: action.value,
      };
    case "add_tenant":
    
      return {
        ...store,
        tenant: action.value,
      };
    case "add_asociation":
    
      return {
        ...store,
        asociation: action.value,
      };
    case "add_contracts":
     
      return {
        ...store,
        contracts: action.value,
      };
    case "add_apartments":
     
      return {
        ...store,
        apartments: action.value,
      };
    default:
      throw Error("Unknown action.");
  }
}
