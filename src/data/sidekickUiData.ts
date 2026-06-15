import {
  ChefHat,
  HeartPulse,
  PartyPopper,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidekickMode = {
  name: string;
  prompt: string;
  icon: LucideIcon;
};

export const sidekickModes: SidekickMode[] = [
  {
    name: "Occasions",
    prompt: "Occasion Mode selected. Tell Sidekick the event and number of people.",
    icon: PartyPopper,
  },
  {
    name: "Recipes",
    prompt: "Recipe Mode selected. Tell Sidekick what you want to cook.",
    icon: ChefHat,
  },
  {
    name: "Emergency",
    prompt: "Emergency Mode selected. Tell Sidekick what happened and how urgent it is.",
    icon: ShieldAlert,
  },
  {
    name: "Healthcare Essentials",
    prompt: "Healthcare Essentials selected. Sidekick can help with basic care items.",
    icon: HeartPulse,
  },
];
