import { QuickAction } from "@/types/chat";

export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "admission",
    label: "Admission Information",
    icon: "🎓",
    prompt: "What are the admission requirements?",
  },
  {
    id: "courses",
    label: "Courses Offered",
    icon: "📚",
    prompt: "What courses are offered?",
  },
  {
    id: "fees",
    label: "Fee Structure",
    icon: "💰",
    prompt: "What is the fee structure?",
  },
  {
    id: "facilities",
    label: "Campus Facilities",
    icon: "🏛️",
    prompt: "What campus facilities are available?",
  },
  {
    id: "events",
    label: "Events & News",
    icon: "📅",
    prompt: "What are the latest events and news?",
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: "📞",
    prompt: "How can I contact the college?",
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  variant?: "grid" | "list";
  onSelect: (action: QuickAction) => void;
}

export default function QuickActions({
  actions = DEFAULT_QUICK_ACTIONS,
  variant = "grid",
  onSelect,
}: QuickActionsProps) {
  if (variant === "list") {
    return (
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action)}
            className="flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-left text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action)}
          className="flex flex-col items-center justify-center gap-1 rounded-xl border border-brand-200 bg-white px-3 py-3 text-center text-xs font-medium text-brand-700 transition hover:bg-brand-50"
        >
          <span className="text-lg">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
