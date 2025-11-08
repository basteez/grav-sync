# Grav Sync

A minimalist web-based puzzle game where players tune gravitational waves to achieve cosmic resonance and stabilize the universe.

## Overview

Grav Sync is a browser-based game built with p5.js that challenges players to synchronize gravitational waves under time pressure. The game features circular wave patterns that wrap around an animated Earth sprite, requiring precise parameter adjustments to achieve perfect wave alignment.

## Game Concept

Players control gravitational wave parameters to match a target wave pattern with randomized frequency. The objective is to achieve constructive interference resonance by adjusting:

- **Amplitude**: The height/intensity of the wave oscillations
- **Frequency**: The number of wave oscillations around the central Earth

The synchronization system weights frequency matching at 80% and amplitude matching at 20%, emphasizing the importance of frequency alignment.

Waves are rendered as concentric, radially oscillating rings around Earth using the mathematical formula:

```
r(θ) = r₀ + A · sin(n·θ + φ)
```

Where `r₀` is the base radius, `A` is amplitude, `n` is frequency, and `φ` is phase shift.

## Features

- **Real-time wave synchronization** with visual feedback and weighted scoring (80% frequency, 20% amplitude)
- **Randomized target waves** with dynamic frequency generation for varied gameplay
- **Animated Earth sprite** with 94-frame rotation animation for immersive visuals
- **Dynamic target waves** that gradually move inward, increasing difficulty
- **Scoring system** based on synchronization accuracy
- **Minimalist cosmic aesthetic** with smooth animations and subtle wave disturbance effects
- **Progressive difficulty** as waves converge toward Earth
- **Instant parameter reset** for quick corrections

## Controls

| Input     | Action                                 |
| --------- | -------------------------------------- |
| `W` / `S` | Increase/decrease wave amplitude       |
| `A` / `D` | Increase/decrease wave frequency       |
| `SPACE`   | Reset all parameters to initial values |

Controls support both instant key presses and continuous input for fine-tuning.

## Technical Details

### Built With

- **p5.js** - Graphics and animation framework
- **p5.sound.js** - Audio capabilities (included for future enhancements)
- **HTML5 Canvas** - Rendering backend
- **Custom Sprite System** - Frame-based animation for Earth rotation

### Architecture

- `sketch.js` - Main game logic and rendering
- `sprite.js` - Sprite class for animation handling
- `index.html` - HTML structure and library imports
- `style.css` - Minimal styling for dark cosmic theme
- `animations/earth.json` - Frame data for Earth sprite sheet (94 frames)
- `sprites/earth.png` - Earth rotation sprite sheet (480x480, 10x10 grid)
- `libraries/` - p5.js framework files

### Game Mechanics

- **Synchronization Calculation**:
  - Uses 36 sample points around the circle to measure wave alignment
  - Weighted scoring: 80% frequency match, 20% amplitude match
  - Phase differences are ignored for simplified gameplay
- **Randomized Target Frequency**: Each round generates a new target frequency (10-30 range)
- **Scoring**: Points awarded when waves achieve >80% synchronization at matching radii
- **Wave Animation**: Continuous rotation with subtle disturbance effects for visual appeal
- **Target Wave Behavior**: Gradually shrinks from outer orbit (radius 380) to inner orbit (radius 80)
- **Sprite Animation**: Earth rotates with variable speed using a 94-frame sprite sheet

## Gameplay Instructions

1. **Observe** the white target wave orbiting around the animated Earth
2. **Adjust** your blue player wave parameters using keyboard controls
3. **Synchronize** the waves to achieve alignment (>80% sync)
   - Focus primarily on matching **frequency** (80% weight)
   - Fine-tune **amplitude** for the remaining 20%
4. **Score points** when waves match at the same orbital radius
5. **Adapt** as the target wave moves closer to Earth with a new random frequency each round

The game features a real-time synchronization meter showing your current alignment percentage. Green text indicates successful synchronization (>80%), while red indicates you need further adjustments. The target frequency is displayed on screen to guide your adjustments.

## Development

### Project Structure

```
grav-sync/
├── README.md           # This file
├── GDD.md             # Detailed Game Design Document
├── ATTRIBUTION.md     # Asset credits and attributions
├── index.html         # Main HTML file
├── sketch.js          # Game logic and rendering
├── sprite.js          # Sprite animation class
├── style.css          # Styling
├── jsconfig.json      # JavaScript configuration
├── animations/
│   └── earth.json     # Earth sprite frame data
├── sprites/
│   └── earth.png      # Earth sprite sheet (480x480)
└── libraries/
    ├── p5.min.js      # p5.js core library
    └── p5.sound.min.js # p5.js sound extension
```

### Key Variables

- `targetWave`: The reference wave players must match (with randomized frequency each round)
- `playerWave`: The user-controlled wave
- `sync`: Real-time synchronization percentage (0-1), weighted 80% frequency / 20% amplitude
- `score`: Points accumulated from successful synchronizations
- `earth`: Animated sprite instance with rotation animation
- `animation`: Array of 94 pre-loaded Earth sprite frames

### Customization

The game can be easily modified by adjusting constants in `sketch.js`:

- Screen dimensions (`screenWith`, `screenHeight`)
- Wave parameter ranges (`minAmplitude`, `maxAmplitude`, `minFrequency`, `maxFrequency`)
- Earth properties (`earthRadius`, position)
- Synchronization threshold (currently 80%)
- Sync weighting (currently 80% frequency, 20% amplitude in `calculateSync()`)
- Target frequency range (currently 10-30 in `getRandomInt()` calls)
- Sprite animation speed (random range 0.1-0.4 in `setup()`)

## License

This project is part of a game jam prototype. Feel free to use, modify, and distribute according to your needs.

## Contributing

Contributions are welcome! Areas for improvement include:

- Audio implementation using p5.sound (wave frequency-based soundscapes)
- Additional visual effects and animations
- Level progression system with increasing difficulty curves
- Mobile touch controls
- Performance optimizations for sprite rendering
- Alternative sprite animations or visual themes
- Adjustable difficulty settings (sync threshold, weight distribution)

## Acknowledgments

Built for game jam development with focus on rapid prototyping and iterative design. The mathematical wave simulation provides an educational element alongside the puzzle gameplay.
