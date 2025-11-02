# Grav Sync

A minimalist web-based puzzle game where players tune gravitational waves to achieve cosmic resonance and stabilize the universe.

## Overview

Grav Sync is a browser-based game built with p5.js that challenges players to synchronize multiple gravitational waves under time pressure. The game features circular wave patterns that wrap around a central Earth, requiring precise parameter adjustments to achieve perfect wave alignment.

## Game Concept

Players control gravitational wave parameters to match a target wave pattern. The objective is to achieve constructive interference resonance by adjusting:

- **Amplitude**: The height/intensity of the wave oscillations
- **Frequency**: The number of wave oscillations around the central Earth
- **Phase**: The angular shift of the wave pattern

Waves are rendered as concentric, radially oscillating rings around Earth using the mathematical formula:

```
r(θ) = r₀ + A · sin(n·θ + φ)
```

Where `r₀` is the base radius, `A` is amplitude, `n` is frequency, and `φ` is phase shift.

## Features

- **Real-time wave synchronization** with visual feedback
- **Dynamic target waves** that gradually move inward, increasing difficulty
- **Scoring system** based on synchronization accuracy
- **Minimalist cosmic aesthetic** with smooth animations
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

### Architecture

- `sketch.js` - Main game logic and rendering
- `index.html` - HTML structure and library imports
- `style.css` - Minimal styling for dark cosmic theme
- `libraries/` - p5.js framework files

### Game Mechanics

- **Synchronization Calculation**: Uses 36 sample points around the circle to measure wave alignment
- **Scoring**: Points awarded when waves achieve >80% synchronization at matching radii
- **Wave Animation**: Continuous rotation with subtle disturbance effects for visual appeal
- **Target Wave Behavior**: Gradually shrinks from outer orbit (radius 380) to inner orbit (radius 50)

## Gameplay Instructions

1. **Observe** the white target wave orbiting around Earth
2. **Adjust** your blue player wave parameters using keyboard controls
3. **Synchronize** the waves to achieve alignment (>80% sync)
4. **Score points** when waves match at the same orbital radius
5. **Adapt** as the target wave moves closer to Earth, increasing difficulty

The game features a real-time synchronization meter showing your current alignment percentage. Green text indicates successful synchronization (>80%), while red indicates you need further adjustments.

## Development

### Project Structure

```
grav-sync/
├── README.md           # This file
├── GDD.md             # Detailed Game Design Document
├── index.html         # Main HTML file
├── sketch.js          # Game logic and rendering
├── style.css          # Styling
├── jsconfig.json      # JavaScript configuration
└── libraries/
    ├── p5.min.js      # p5.js core library
    └── p5.sound.min.js # p5.js sound extension
```

### Key Variables

- `targetWave`: The reference wave players must match
- `playerWave`: The user-controlled wave
- `sync`: Real-time synchronization percentage (0-1)
- `score`: Points accumulated from successful synchronizations

### Customization

The game can be easily modified by adjusting constants in `sketch.js`:

- Screen dimensions (`screenWith`, `screenHeight`)
- Wave parameter ranges (`minAmplitude`, `maxAmplitude`, etc.)
- Earth properties (`earthRadius`, position)
- Synchronization threshold (currently 80%)

## License

This project is part of a game jam prototype. Feel free to use, modify, and distribute according to your needs.

## Contributing

Contributions are welcome! Areas for improvement include:

- Audio implementation using p5.sound
- Additional visual effects and animations
- Level progression system
- Mobile touch controls
- Performance optimizations

## Acknowledgments

Built for game jam development with focus on rapid prototyping and iterative design. The mathematical wave simulation provides an educational element alongside the puzzle gameplay.
