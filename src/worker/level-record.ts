export interface SphericalPoint {
  /**
   * Y-coordinate replaced by Polar Angle (θ).
   * Corresponds to latitude.
   */
  readonly polar: number;
  /**
   * Z-coordinate replaced by Azimuthal Angle (φ)
   * Corresponds to longitude.
   */
  readonly azimuthal: number;
}

export interface Vector {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Ray {
  readonly origin: Vector;
  readonly direction: Vector;
}

export interface CurrentLevel {
  readonly audio: SphericalPoint;
  readonly startTime: number;
}

export interface CompletedLevel extends CurrentLevel {
  pointer: SphericalPoint;
  endTime: number;
}

export class GameState {
  completedLevels: Readonly<CompletedLevel>[] = [];
  currentLevel?: CurrentLevel;

  constructor(public readonly stageRadius: number) {}

  randomAudioPoint(): SphericalPoint {
    return {
      polar: 0,
      azimuthal: 0,
    };
  }

  startLevel(audioPosition = this.randomAudioPoint(), now = Date.now()) {
    if (this.currentLevel) {
      throw new Error("Level already started");
    }
    const level = {
      audio: audioPosition,
      startTime: now,
    };
    this.currentLevel = level;
    return level;
  }

  completeLevel(pointerPosition: SphericalPoint, now = Date.now()) {
    if (!this.currentLevel) {
      throw new Error("Cannot complete level before it starts");
    }
    const level = this.currentLevel as CompletedLevel;
    level.pointer = pointerPosition;
    level.endTime = now;
    this.completedLevels.push(level);
    this.currentLevel = undefined;
    return level;
  }

  waitTime() {
    return 10_000;
  }
}
