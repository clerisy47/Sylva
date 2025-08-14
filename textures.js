import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

/**
 * Gets a bark texture for the specified bark type
 * @param {string} barkType 
 * @param {'ao' | 'color' | 'normal' | 'roughness'} fileType 
 * @param {THREE.Vector2} scale 
 * @returns 
 */
export function getBarkTexture(barkType, fileType, scale = { x: 1, y: 1 }) {
  const texture = textures.bark[barkType][fileType];
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = scale.x;
  texture.repeat.y = 1 / scale.y;
  return texture;
}

/**
 * Gets the leaf texture for the specified leaf type
 * @param {string} leafType 
 * @returns 
 */
export function getLeafTexture(leafType) {
  return textures.leaves[leafType];
}

/**
 * 
 * @param {string} url Path to texture
 * @param {THREE.Vector2} scale Scale of the texture repeat
 * @param {boolean} srgb Set to true to set texture color space to SRGB
 * @returns {THREE.Texture}
 */
const loadTexture = (url, srgb = true) => {
  const texture = textureLoader.load(url);
  texture.premultiplyAlpha = true;
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return texture;
};

const textures = {
  "bark": {
    "birch": {
      "ao": loadTexture('/bark/birch_ao_1k.jpg', false),
      "color": loadTexture('/bark/birch_color_1k.jpg'),
      "normal": loadTexture('/bark/birch_normal_1k.jpg', false),
      "roughness": loadTexture('/bark/birch_roughness_1k.jpg', false),
    },
    "oak": {
      "ao": loadTexture('/bark/oak_ao_1k.jpg', false),
      "color": loadTexture('/bark/oak_color_1k.jpg'),
      "normal": loadTexture('/bark/oak_normal_1k.jpg', false),
      "roughness": loadTexture('/bark/oak_roughness_1k.jpg', false),
    },
    "pine": {
      "ao": loadTexture('/bark/pine_ao_1k.jpg', false),
      "color": loadTexture('/bark/pine_color_1k.jpg'),
      "normal": loadTexture('/bark/pine_normal_1k.jpg', false),
      "roughness": loadTexture('/bark/pine_roughness_1k.jpg', false),
    },
    "willow": {
      "ao": loadTexture('/bark/willow_ao_1k.jpg', false),
      "color": loadTexture('/bark/willow_color_1k.jpg'),
      "normal": loadTexture('/bark/willow_normal_1k.jpg', false),
      "roughness": loadTexture('/bark/willow_roughness_1k.jpg', false),
    }
  },
  "leaves": {
    "ash": loadTexture('/leaves/ash_color.png'),
    "aspen": loadTexture('/leaves/aspen_color.png'),
    "oak": loadTexture('/leaves/oak_color.png'),
    "pine": loadTexture('/leaves/pine_color.png')
  }
};