import TreeOptions from '../options.js';

// Store presets cache
let presetsCache = null;

/**
 * @param {string} name The name of the preset to load
 * @returns {Promise<TreeOptions>}
 */
export async function loadPreset(name) {
  if (!presetsCache) {
    await loadAllPresets();
  }
  
  const preset = presetsCache[name];
  return preset ? structuredClone(preset) : new TreeOptions();
}

/**
 * Load all available presets
 */
async function loadAllPresets() {
  const presetFiles = [
    'ash_small', 'ash_medium', 'ash_large',
    'aspen_small', 'aspen_medium', 'aspen_large',
    'bush_1', 'bush_2', 'bush_3',
    'oak_small', 'oak_medium', 'oak_large',
    'pine_small', 'pine_medium', 'pine_large'
  ];

  presetsCache = {};

  for (const file of presetFiles) {
    try {
      const response = await fetch(`./presets/${file}.json`);
      const data = await response.json();
      
      // Convert filename to preset name
      const presetName = file.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      presetsCache[presetName] = data;
    } catch (error) {
      console.warn(`Failed to load preset ${file}:`, error);
    }
  }
}

export const TreePreset = {
  async load(name) {
    return await loadPreset(name);
  },
  
  async getAll() {
    if (!presetsCache) {
      await loadAllPresets();
    }
    return Object.keys(presetsCache);
  }
};