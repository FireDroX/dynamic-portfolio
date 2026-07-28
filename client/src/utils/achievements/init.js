import {
  registerAchievementUnlocks,
  registerCheaterAchievement,
  registerCompletionTracker,
} from "./unlocks";
import { trackVisitAchievements } from "./visitTracker";
import { registerProjectTracker } from "./projectTracker";
import { registerDiscoveryTracker } from "./discoveryTracker";

export function initializeAchievements() {
  registerAchievementUnlocks();
  trackVisitAchievements();
  registerProjectTracker();
  registerDiscoveryTracker();
  registerCompletionTracker();
  registerCheaterAchievement();
}
