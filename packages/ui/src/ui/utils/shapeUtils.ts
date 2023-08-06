import Shape = Phaser.GameObjects.Shape
import Rectangle = Phaser.Geom.Rectangle
import Arc = Phaser.GameObjects.Arc
import Sprite = Phaser.GameObjects.Sprite

function createUpscaledRectangle(originalRectangle: Rectangle, arcToCompare: Arc) {
  return new Rectangle(originalRectangle.x - arcToCompare.radius,
    originalRectangle.y - arcToCompare.radius, originalRectangle.width + (arcToCompare.radius * 2)
    , originalRectangle.height + (arcToCompare.radius * 2))
}

export function doShapesIntersect(shape1: any, shape2: any): boolean {
  console.log(shape1)
  console.log(shape2)

  if (shape1.type === 'Sprite' && shape2.type === 'Sprite') {
    const boundsA = shape1.getBounds();
    const boundsB = shape2.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }

  if ((shape1.type === 'Sprite' || shape1.type === 'Rectangle' || shape1.type === 'rexImageBox') && (shape2.type === 'Sprite' || shape2.type === 'Rectangle' || shape1.type === 'rexImageBox')) {
    return Phaser.Geom.Intersects.RectangleToRectangle(shape1 as any, shape2 as any)
  }

  if ((shape1.type === 'Circle' || shape1.type === 'Arc') && (shape2.type === 'Circle' || shape2.type === 'Arc')) {
    return Phaser.Geom.Intersects.CircleToCircle(shape1 as any, shape2 as any)
  }

  if ((shape1.type === 'Circle' || shape1.type === 'Arc') && (shape2.type === 'Sprite' || shape2.type === 'Rectangle' || shape1.type === 'rexImageBox')) {
    const upscaledRectangle = createUpscaledRectangle(shape2, shape1)

    return Phaser.Geom.Intersects.CircleToRectangle(shape1 as any, upscaledRectangle)
  }

  if ((shape1.type === 'Sprite' || shape1.type === 'Rectangle' || shape1.type === 'rexImageBox') && (shape2.type === 'Circle' || shape2.type === 'Arc')) {
    const upscaledRectangle = createUpscaledRectangle(shape1, shape2)

    return Phaser.Geom.Intersects.CircleToRectangle(shape2 as any, upscaledRectangle)
  }

  return false
}
