import { BladesSheet } from "./blades-sheet.js";
import { BladesActiveEffect } from "./blades-active-effect.js";
import { BladesHelpers } from "./blades-helpers.js";

/**
 * BladesGoodSheet: Alternate 3-column actor sheet
 * @extends {BladesSheet}
 */
export class BladesGoodSheet extends BladesSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["blades-in-the-dark", "sheet", "actor", "goodsheet"],
      template: "systems/blades-in-the-dark/templates/blades.goodsheet.html",
      width: 1100,
      height: "auto"
    });
  }

  /** @override */
  async getData(options) {
    const superData = await super.getData(options);
    const sheetData = superData.data;
    sheetData.owner = superData.owner;
    sheetData.editable = superData.editable;
    sheetData.isGM = game.user.isGM;
    sheetData.effects = BladesActiveEffect.prepareActiveEffectCategories(this.actor.effects);
    // Copy loadout logic from BladesActorSheet
    let loadout = 0;
    sheetData.items.forEach(i => {loadout += (i.type === "item") ? parseInt(i.system.load) : 0});
    if (loadout < 0) loadout = 0;
    if (loadout > 11) loadout = 11;
    sheetData.system.loadout = loadout;
    let load_level, mule_level;
    if (game.settings.get('blades-in-the-dark', 'DeepCutLoad')) {
      load_level=["BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Conspicuous","BITD.Conspicuous","BITD.Encumbered","BITD.Encumbered","BITD.Encumbered","BITD.OverMax","BITD.OverMax"];
      mule_level=["BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Discreet","BITD.Conspicuous","BITD.Conspicuous","BITD.Encumbered","BITD.Encumbered","BITD.OverMax"];
    } else {
      load_level=["BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Normal","BITD.Normal","BITD.Heavy","BITD.Encumbered","BITD.Encumbered","BITD.Encumbered","BITD.OverMax","BITD.OverMax"];
      mule_level=["BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Light","BITD.Normal","BITD.Normal","BITD.Heavy","BITD.Encumbered","BITD.OverMax","BITD.OverMax"];
    }
    let mule_present=0;
    sheetData.items.forEach(i => { if (i.type === "ability" && i.name === "(C) Mule") mule_present = 1; });
    if (mule_present) {
      sheetData.system.load_level=mule_level[loadout];
    } else {
      sheetData.system.load_level=load_level[loadout];
    }
    if (game.settings.get('blades-in-the-dark', 'DeepCutLoad')) {
      sheetData.system.load_levels = {"BITD.Discreet":"BITD.Discreet", "BITD.Conspicuous":"BITD.Conspicuous"};
    } else {
      sheetData.system.load_levels = {"BITD.Light":"BITD.Light", "BITD.Normal":"BITD.Normal", "BITD.Heavy":"BITD.Heavy"};
    }
    sheetData.system.description = await TextEditor.enrichHTML(sheetData.system.description, {secrets: sheetData.owner, async: true});
    sheetData.system.attributes = this.actor.getComputedAttributes();
    sheetData.system.stress.max = this.actor.getMaxStress();
    sheetData.system.trauma.max = this.actor.getMaxTrauma();
    sheetData.system.healing_clock.value = this.actor.getHealingMin();
    return sheetData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    if (!this.options.editable) return;
    html.find('.crew-delete').click(ev => {
      const element = $(ev.currentTarget).parents(".item");
      let crewId = element.data("itemId");
      BladesHelpers.removeCrew(this.actor, crewId);
    });
  }
}
