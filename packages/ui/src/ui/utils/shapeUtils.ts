import Shape = Phaser.GameObjects.Shape
import Rectangle = Phaser.Geom.Rectangle
import Arc = Phaser.GameObjects.Arc

function createUpscaledRectangle(originalRectangle: Rectangle, arcToCompare: Arc) {
  return new Rectangle(originalRectangle.x - arcToCompare.radius,
    originalRectangle.y - arcToCompare.radius, originalRectangle.width + (arcToCompare.radius * 2)
    , originalRectangle.height + (arcToCompare.radius * 2))
}

export function doShapesIntersect(shape1: any, shape2: any): boolean {
  console.log(shape1)
  console.log(shape2)

  if (shape1.type === 'Rectangle' && shape2.type === 'Rectangle') {
    return Phaser.Geom.Intersects.RectangleToRectangle(shape1 as any, shape2 as any)
  }

  if ((shape1.type === 'Circle' || shape1.type === 'Arc') && (shape2.type === 'Circle' || shape2.type === 'Arc')) {
    return Phaser.Geom.Intersects.CircleToCircle(shape1 as any, shape2 as any)
  }

  if ((shape1.type === 'Circle' || shape1.type === 'Arc') && shape2.type === 'Rectangle') {
    const upscaledRectangle = createUpscaledRectangle(shape2, shape1)

    return Phaser.Geom.Intersects.CircleToRectangle(shape1 as any, upscaledRectangle)
  }

  if (shape1.type === 'Rectangle' && (shape2.type === 'Circle' || shape2.type === 'Arc')) {
    const upscaledRectangle = createUpscaledRectangle(shape1, shape2)

    return Phaser.Geom.Intersects.CircleToRectangle(shape2 as any, upscaledRectangle)
  }

  return false
}
