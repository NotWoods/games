export type SphereColor = 'black' | 'blue' | 'green' | 'orange' | 'white';

/**
 * touch: <colorA> and <colorB> must touch!
 * not-touch: <colorA> and <colorB> must not touch!
 */
export interface TouchTask {
  type: 'touch' | 'not-touch';
  colorA: SphereColor;
  colorB: SphereColor;
}

/**
 * There must be exactly <amount> <color>!
 */
export interface ExactTask {
  type: 'exact';
  amount: number;
  color: SphereColor;
}

/**
 * The sum of <colorA> and <colorB> must be exactly <amount>!
 */
export interface SumTask {
  type: 'sum';
  amount: number;
  colorA: SphereColor;
  colorB: SphereColor;
}

/**
 * There must be more <colorA> than <colorB>!
 */
export interface MoreTask {
  type: 'more';
  colorA: SphereColor;
  colorB: SphereColor;
}

/**
 * not-over: <color> must not be on top of any spheres!
 * not-under: <color> must not be underneath any spheres!
 */
export interface StackTask {
  type: 'not-over' | 'not-under';
  color: SphereColor;
}

export type Task = TouchTask | ExactTask | SumTask | MoreTask | StackTask;
