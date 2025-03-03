import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionCategory } from "@/store/walletStore";

const getTypeColor = (type: TransactionCategory) => {
  const health = useThemeColor({}, "health");
  const income = useThemeColor({}, "income");
  const utilities = useThemeColor({}, "utilities");
  const clothing = useThemeColor({}, "clothing");
  const dining = useThemeColor({}, "dining");
  const groceries = useThemeColor({}, "groceries");
  const sports = useThemeColor({}, "sports");

  switch (type) {
    case TransactionCategory.Health:
      return health;
    case TransactionCategory.Income:
      return income;
    case TransactionCategory.Utilities:
      return utilities;
    case TransactionCategory.Clothing:
      return clothing;
    case TransactionCategory.Dining:
      return dining;
    case TransactionCategory.Groceries:
      return groceries;
    case TransactionCategory.Sports:
      return sports;
    default:
      return health;
  }
};

const getTypeIcon = (type: TransactionCategory) => {
  switch (type) {
    case TransactionCategory.Health:
      return "heart";
    case TransactionCategory.Income:
      return "attach-money";
    case TransactionCategory.Utilities:
      return "lightbulb-o";
    case TransactionCategory.Clothing:
      return "tshirt-crew";
    case TransactionCategory.Dining:
      return "silverware-fork-knife";
    case TransactionCategory.Groceries:
      return "shopping-cart";
    case TransactionCategory.Sports:
      return "dumbbell";
    default:
      return "";
  }
};

export { getTypeColor, getTypeIcon };
