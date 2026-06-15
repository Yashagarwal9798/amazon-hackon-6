import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder: string;
  compact?: boolean;
};

export default function SearchBar({ placeholder, compact = false }: SearchBarProps) {
  return (
    <div className={compact ? "search-bar search-bar-compact" : "search-bar"}>
      <Search size={22} />
      <input aria-label="Search" placeholder={placeholder} />
    </div>
  );
}
