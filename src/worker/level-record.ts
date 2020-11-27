import { distanceSquared } from './math';
import { sphericalToCartesian } from './radian-math';

export interface SphericalPoint {
  /**
   * Y-coordinate replaced by Polar Angle (θ).
   * Corresponds to latitude.
   */
  readonly theta: number;
  /**
   * Z-coordinate replaced by Azimuthal Angle (φ)
   * Corresponds to longitude.
   */
  readonly phi: number;
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
  pointer?: SphericalPoint;
  score: number;
  goodScore: boolean;
  endTime: number;
}

export function timeout(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const GOOD_SCORE_THRESHOLD = 1.5 ** 2;

export class GameState {
  completedLevels: Readonly<CompletedLevel>[] = [];
  currentLevel?: CurrentLevel;
  lastLostLevelIndex = -1;

  constructor(public readonly stageRadius: number) {}

  startLevel(audioPosition: SphericalPoint, now = Date.now()) {
    if (this.currentLevel) {
      this.completeLevel(undefined, now);
    }
    const level = {
      audio: audioPosition,
      startTime: now,
    };
    this.currentLevel = level;
    return level;
  }

  completeLevel(pointerPosition: SphericalPoint | undefined, now = Date.now()) {
    if (!this.currentLevel) {
      throw new Error('Cannot complete level before it starts');
    }
    const level = this.currentLevel as CompletedLevel;
    level.pointer = pointerPosition;
    level.score = pointerPosition
      ? this.score(level.audio, pointerPosition)
      : -1;
    level.goodScore = this.goodScore(level.score);
    level.endTime = now;
    this.completedLevels.push(level);
    this.currentLevel = undefined;
    if (!level.goodScore) {
      this.lastLostLevelIndex = this.completedLevels.length - 1;
    }
    return level;
  }

  totalScore() {
    if (this.lastLostLevelIndex === -1) return this.completedLevels.length;
    return this.completedLevels.length - this.lastLostLevelIndex - 1;
  }

  goodScore(score: number) {
    return score >= 0 && score < GOOD_SCORE_THRESHOLD;
  }

  private score(audioPos: SphericalPoint, pointerPos: SphericalPoint) {
    const audio = sphericalToCartesian(audioPos, this.stageRadius);
    const pointer = sphericalToCartesian(pointerPos, this.stageRadius);
    return distanceSquared(audio, pointer);
  }
}
