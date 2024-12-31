import { useThemeColor } from "@/hooks/useThemeColor";

export enum TransactionType {
  general = "general",
  health = "health",
  income = "income",
  utilities = "utilities",
  clothing = "clothing",
  dining = "dining",
  groceries = "groceries",
  sports = "sports",
}

const getTypeColor = (type: TransactionType) => {
  const health = useThemeColor({}, "health");
  const income = useThemeColor({}, "income");
  const utilities = useThemeColor({}, "utilities");
  const clothing = useThemeColor({}, "clothing");
  const dining = useThemeColor({}, "dining");
  const groceries = useThemeColor({}, "groceries");
  const sports = useThemeColor({}, "sports");

  switch (type) {
    case TransactionType.health:
      return health;
    case TransactionType.income:
      return income;
    case TransactionType.utilities:
      return utilities;
    case TransactionType.clothing:
      return clothing;
    case TransactionType.dining:
      return dining;
    case TransactionType.groceries:
      return groceries;
    case TransactionType.sports:
      return sports;
    default:
      return health;
  }
};

const getTypeIcon = (type: TransactionType) => {
  switch (type) {
    case TransactionType.health:
      return "heart";
    case TransactionType.income:
      return "attach-money";
    case TransactionType.utilities:
      return "lightbulb-o";
    case TransactionType.clothing:
      return "tshirt-crew";
    case TransactionType.dining:
      return "silverware-fork-knife";
    case TransactionType.groceries:
      return "shopping-cart";
    case TransactionType.sports:
      return "dumbbell";
    default:
      return "";
  }
};

export { getTypeColor, getTypeIcon };
