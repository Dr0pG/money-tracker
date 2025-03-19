import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionCategory, TransactionType } from "@/store/walletStore";

const getTypeColor = (type: TransactionCategory | TransactionType) => {
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
    case TransactionType.Income:
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

const getTypeIcon = (type: TransactionCategory | TransactionType) => {
  switch (type) {
    case TransactionCategory.Health:
      return "heart";
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
    case TransactionType.Income:
      return "attach-money";
    default:
      return "";
  }
};

export { getTypeColor, getTypeIcon };

