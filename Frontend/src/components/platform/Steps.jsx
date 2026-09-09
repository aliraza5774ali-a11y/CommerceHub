import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

// Single source of truth for the demo sequence: sidebar labels/icons and
// how long each screen holds before the demo advances. Purely a visual
// product demonstration — no routing, no real data, no backend calls.
export const DEMO_STEPS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "customers", label: "Customers", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

export const STEP_HOLD_MS = 2800;