import {
  BookOpen,
  Building2,
  CircleHelp,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Franchise Management", icon: Building2, active: true },
  { label: "Student Management", icon: Users },
  { label: "LMS", icon: BookOpen },
  { label: "Finance", icon: Wallet },
  { label: "HRMS", icon: GraduationCap },
  { label: "Centers", icon: LayoutDashboard },
  { label: "Assets", icon: CreditCard },
  { label: "Support", icon: CircleHelp },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            className={`nav-link ${active ? "active" : ""}`}
            href="#batch-operations"
            key={label}
            onClick={(event) => event.preventDefault()}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <a
          className="nav-link"
          href="#logout"
          onClick={(e) => e.preventDefault()}
        >
          <LogOut size={17} />
          Log Out
        </a>
      </div>
    </aside>
  );
}
