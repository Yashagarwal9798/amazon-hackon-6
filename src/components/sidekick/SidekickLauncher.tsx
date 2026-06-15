import { Bot, Sparkles } from "lucide-react";

type SidekickLauncherProps = {
  onOpen: () => void;
};

export default function SidekickLauncher({ onOpen }: SidekickLauncherProps) {
  return (
    <button className="sidekick-launcher" type="button" onClick={onOpen} aria-label="Open Amazon Sidekick">
      <span className="sidekick-launcher-bubble">Can I help build your cart?</span>
      <span className="sidekick-bot-avatar" aria-hidden="true">
        <Bot size={28} />
        <Sparkles size={15} />
      </span>
    </button>
  );
}
