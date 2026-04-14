/**
 * ARITHMAGEN CORE: Geometry Engine v1.0
 * The "Device" for perfect mathematical closure.
 */

export interface Point {
    x: number;
    y: number;
  }
  
  /**
   * Calculates a point on a circle/arc with precision.
   * This is the foundation of the "Blueprint" logic.
   */
  export const calculateVector = (
    centerX: number, 
    centerY: number, 
    radius: number, 
    angleInDegrees: number
  ): Point => {
    const radians = (angleInDegrees * Math.PI) / 180;
    return {
      // We keep the math raw here; the UI component handles the Math.round
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians)
    };
  };
  
  /**
   * Closes the loop. 
   * Takes an array of points and ensures the final vector snaps to the start.
   */
  export const closeLoop = (points: Point[]): Point[] => {
    if (points.length < 3) return points;
    return [...points, points[0]]; // Forces the "ends to meet perfectly"
  };