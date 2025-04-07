import { useThemeColor } from "@/hooks/useThemeColor";
import { TransactionCategory, TransactionType } from "@/store/walletStore";

const getTypeColor = (type: TransactionCategory | TransactionType) => {
  const [
    health,
    income,
    utilities,
    clothing,
    dining,
    groceries,
    sports,
    rent,
    transportation,
    entertainment,
    insurance,
    personal,
    investments,
    other,
  ] = useThemeColor({}, [
    "health",
    "income",
    "utilities",
    "clothing",
    "dining",
    "groceries",
    "sports",
    "rent",
    "transportation",
    "entertainment",
    "insurance",
    "personal",
    "investments",
    "other",
  ]);

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
    case TransactionCategory.Rent:
      return rent;
    case TransactionCategory.Transportation:
      return transportation;
    case TransactionCategory.Entertainment:
      return entertainment;
    case TransactionCategory.Insurance:
      return insurance;
    case TransactionCategory.Personal:
      return personal;
    case TransactionCategory.Investments:
      return investments;
    case TransactionCategory.Other:
      return other;
    default:
      return health;
  }
};

const getTypeIcon = (type: TransactionCategory | TransactionType) => {
  switch (type) {
    case TransactionType.Income:
      return "attach-money";
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
    case TransactionCategory.Rent:
      return "home";
    case TransactionCategory.Transportation:
      return "car";
    case TransactionCategory.Entertainment:
      return "gamepad";
    case TransactionCategory.Insurance:
      return "shield-checkmark";
    case TransactionCategory.Personal:
      return "user";
    case TransactionCategory.Investments:
      return "chart-line";
    case TransactionCategory.Other:
      return "ellipsis-h";
    default:
      return "";
  }
};

export { getTypeColor, getTypeIcon };

