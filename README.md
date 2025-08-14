# Fractal Tree Forest - Three.js

A sophisticated Three.js application that generates procedural fractal trees with realistic textures, wind animation, and multiple tree species.

## 🚀 Quick Start

### Development Server
```bash
npm install
npm run dev
```

This will:
- Install dependencies (Vite, Three.js)
- Start the development server on `http://localhost:3000`
- Automatically open the fractal forest in your browser
- Enable hot reloading for development

## 🛠️ Development Commands

```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm start        # Alias for npm run dev
```

## 📁 Project Structure

```
fractal-tree-forest/
├── index.html             # Main application entry point
├── main.js                # Core fractal forest application
├── tree.js                # Tree generation class
├── branch.js              # Branch geometry and structure
├── options.js             # Tree configuration parameters
├── textures.js            # Texture loading and management
├── enums.js               # Tree type enumerations
├── rng.js                 # Seeded random number generator
├── assets/                # Texture assets
│   ├── bark/              # Bark textures (AO, Color, Normal, Roughness)
│   └── leaves/            # Leaf textures
├── presets/               # Pre-configured tree types
├── package.json           # Node.js dependencies
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## Features

🌳 **Procedural Tree Generation**
- Multiple tree species (Oak, Pine, Ash, Aspen, Birch, Willow)
- Fractal branching algorithms
- Realistic bark and leaf textures
- Customizable tree parameters

🍃 **Dynamic Effects**
- Real-time wind animation using GLSL shaders
- Dynamic leaf movement with Simplex noise
- Seasonal color variations

🎮 **Interactive Scene**
- Mouse orbit controls
- Zoom in/out with scroll wheel
- Multiple camera angles
- 25+ generated trees per scene

🎨 **Visual Quality**
- High-quality PBR textures
- Shadow mapping
- Atmospheric fog
- Tone mapping for realistic lighting

## Project Structure

```
├── main.js              # Main Three.js application
├── tree.js              # Core tree generation class
├── branch.js            # Branch geometry and structure
├── options.js           # Tree configuration parameters
├── textures.js          # Texture loading and management
├── enums.js             # Tree type enumerations
├── rng.js               # Seeded random number generator
├── index.html           # Web page entry point
├── assets/              # Texture assets
│   ├── bark/           # Bark textures (AO, Color, Normal, Roughness)
│   └── leaves/         # Leaf textures
└── presets/            # Pre-configured tree types
    ├── oak_*.json      # Oak tree variations
    ├── pine_*.json     # Pine tree variations
    ├── ash_*.json      # Ash tree variations
    └── ...
```

## Tree Generation Algorithm

The fractal tree generation follows these principles:

1. **Recursive Branching**: Each branch can spawn child branches at configurable levels
2. **Realistic Physics**: Growth forces, twist, and gnarliness parameters
3. **Procedural Variation**: Seeded random generation for consistent but varied results
4. **Texture Mapping**: UV-mapped bark and billboard leaf textures
5. **Level-of-Detail**: Configurable segment/section counts per branch level

## Tree Parameters

### Branch Properties
- `levels`: Number of recursive branch levels (0 = trunk only)
- `length`: Length of branches at each level
- `radius`: Thickness of branches at each level  
- `angle`: Branching angle from parent branch
- `children`: Number of child branches per level
- `sections`: Number of cylindrical sections per branch
- `segments`: Number of radial segments per section
- `taper`: Branch thickness reduction along length
- `gnarliness`: Random branch curvature/twist
- `start`: Where along parent branch children spawn (0-1)

### Leaf Properties
- `type`: Leaf texture (Oak, Pine, Ash, Aspen)
- `count`: Number of leaves per terminal branch
- `size`: Leaf billboard size
- `billboard`: Single or double-sided leaf planes
- `angle`: Leaf orientation relative to branch
- `alphaTest`: Transparency cutoff for leaf textures

### Bark Properties
- `type`: Bark texture set (Oak, Pine, Birch, Willow)
- `textured`: Enable/disable PBR texturing
- `tint`: Color tint overlay
- `textureScale`: UV repeat scaling

## Usage

1. **Local Development**:
   ```bash
   python3 -m http.server 8000
   # Open http://localhost:8000 in browser
   ```

2. **Controls**:
   - Click and drag to orbit camera
   - Scroll wheel to zoom in/out
   - Trees automatically animate with wind

3. **Customization**:
   ```javascript
   // Create custom tree
   const options = new TreeOptions();
   options.seed = 12345;
   options.branch.levels = 4;
   options.leaves.type = LeafType.Oak;
   
   const tree = new Tree(options);
   tree.generate();
   scene.add(tree);
   ```

## Technical Details

### Geometry Generation
- Procedural cylinder generation for branches
- UV mapping for seamless texture application
- Optimized triangle indexing
- Billboard quads for leaves

### Shader Effects
- Custom GLSL wind animation
- Simplex noise for natural movement
- Time-based oscillation with multiple frequencies
- Vertex displacement in world space

### Performance
- Efficient geometry batching
- Texture atlas optimization
- Shadow map optimization
- Frustum culling ready

## Tree Species Available

- **Oak**: Classic deciduous with broad leaves
- **Pine**: Evergreen conifer with needle textures  
- **Ash**: Tall deciduous with compound leaves
- **Aspen**: Slender with distinctive bark
- **Birch**: White bark with small leaves
- **Willow**: Drooping branches (via parameter tuning)

## Preset Configurations

Pre-built tree configurations are available:
- Small, Medium, Large variants
- Bush configurations
- Species-specific optimal parameters
- Seasonal variations

## Browser Requirements

- Modern browser with WebGL 2.0 support
- ES6 module support
- Hardware acceleration recommended

## Credits

Built with Three.js r165
Textures: High-quality PBR bark and leaf materials
Algorithms: Procedural L-system inspired branching
