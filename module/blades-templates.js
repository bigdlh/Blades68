/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/Blades68/templates/parts/coins.html",
    "systems/Blades68/templates/parts/attributes.html",
    "systems/Blades68/templates/parts/turf-list.html",
    "systems/Blades68/templates/parts/cohort-block.html",
    "systems/Blades68/templates/parts/factions.html",
    "systems/Blades68/templates/parts/active-effects.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
