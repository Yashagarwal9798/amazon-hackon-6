import { Sparkles } from "lucide-react";

type SidekickLauncherProps = {
  onOpen: () => void;
};

export default function SidekickLauncher({ onOpen }: SidekickLauncherProps) {
  return (
    <button className="sidekick-launcher" type="button" onClick={onOpen}>
      <span>
        <Sparkles size={20} />
        Amazon Sidekick
      </span>
      <small>Need help shopping faster?</small>
    </button>
  );
}
