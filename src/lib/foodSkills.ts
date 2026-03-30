/**
 * Crafting skill definitions for Project Gorgon.
 *
 * This module defines which game skills are crafting-related, which are purely
 * gathering, and how skills are grouped in the UI sidebar.
 *
 * The app uses these sets to:
 *  - Filter recipes on the Recipe Tracker and Gold Efficiency pages
 *  - Decide which intermediate crafting steps to auto-resolve (CRAFT_SKILLS)
 *  - Merge Fishing + Angling under a single sidebar entry (MERGED_FISHING)
 *  - Exclude non-craftable combat skills (EXCLUDED_SKILLS)
 *
 * How to change:
 *  - When a new skill is added to Project Gorgon, it will automatically appear
 *    in the sidebar as long as it has recipes in the CDN data.
 *  - If a skill should be excluded (e.g. combat skills with transmutation recipes),
 *    add its InternalName to EXCLUDED_SKILLS.
 *  - Gathering skills (Butchering, Fishing, Angling) are intentionally excluded from
 *    CRAFT_SKILLS because their outputs are raw materials, not intermediate crafts.
 */

/**
 * Skills excluded from the crafting UI — combat/magic skills that have recipes
 * in the CDN data but aren't meaningfully trackable through crafting alone.
 */
export const EXCLUDED_SKILLS = new Set([
  "FireMagic",
  "IceMagic",
  "WeatherWitching",
]);

/**
 * A Set subclass whose `.has()` accepts any skill not in EXCLUDED_SKILLS.
 * This lets the app show all crafting skills from CDN data without needing
 * to enumerate every skill name upfront.
 */
class AllCraftingSkills extends Set<string> {
  override has(skill: string): boolean {
    return !EXCLUDED_SKILLS.has(skill);
  }
}

/**
 * All crafting skills in Project Gorgon. The `.has()` method returns true for
 * any skill not in EXCLUDED_SKILLS, so new CDN skills are accepted automatically.
 * The Set contents are used for iteration/size when needed.
 */
export const FOOD_SKILLS: Set<string> = new AllCraftingSkills([
  "Cooking",
  "Cheesemaking",
  "Gourmand",
  "Gardening",
  "Fishing",
  "Angling",
  "Butchering",
  "Mycology",
  "SushiPreparation",
  "IceConjuration",
  "Toolcrafting",
  "Carpentry",
  "Leatherworking",
  "Tailoring",
  "Dyemaking",
  "Fletching",
  "Alchemy",
  "Tanning",
  "Skinning",
  "BattleChemistry",
  "Sigil_Scripting",
  "Lore",
]);

/** Check if a skill is a valid crafting skill (not excluded) */
export function isCraftingSkill(skill: string): boolean {
  return !EXCLUDED_SKILLS.has(skill);
}

/** Split a CamelCase skill ID into a human-readable label, e.g. "SushiPreparation" → "Sushi Preparation" */
export function formatSkillName(id: string): string {
  return id.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Skills where the planner should auto-resolve intermediate crafting steps.
 * Gathering skills (Butchering, Fishing, Angling) are excluded because their
 * outputs (Salt, meat, fish) are better treated as raw materials to purchase
 * or farm rather than intermediate crafts to queue.
 */
export const CRAFT_SKILLS = new Set([
  "Cooking",
  "Cheesemaking",
  "Gardening",
  "Mycology",
  "SushiPreparation",
  "IceConjuration",
]);

/** Skills that should be merged under "Fishing" in the sidebar */
export const MERGED_FISHING = new Set(["Fishing", "Angling"]);

/** Check if a recipe's skill matches the selected sidebar skill (handles Fishing/Angling merge) */
export function matchesSelectedSkill(recipeSkill: string, selectedSkill: string): boolean {
  if (!selectedSkill) return true;
  if (selectedSkill === "Fishing") return MERGED_FISHING.has(recipeSkill);
  return recipeSkill === selectedSkill;
}
