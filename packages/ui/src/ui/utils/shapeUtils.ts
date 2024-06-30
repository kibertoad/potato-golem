import Shape = Phaser.GameObjects.Shape
import Rectangle = Phaser.Geom.Rectangle
import Arc = Phaser.GameObjects.Arc
import Sprite = Phaser.GameObjects.Sprite
import Container = Phaser.GameObjects.Container
import Graphics = Phaser.GameObjects.Graphics

function createUpscaledRectangle(originalRectangle: Rectangle, arcToCompare: Arc) {
  return new Rectangle(
    originalRectangle.x - arcToCompare.radius,
    originalRectangle.y - arcToCompare.radius,
    originalRectangle.width + arcToCompare.radius * 2,
    originalRectangle.height + arcToCompare.radius * 2,
  )
}

function resolveType(shape: any) {
 return typeof shape.type !== 'number' ? shape.type : shape.constructor.name
}

export function doShapesIntersect(shape1: any, shape2: any): boolean {
  console.log(shape1)
  console.log(shape2)

  const type1 = resolveType(shape1)
  const type2 = resolveType(shape2)

  console.log('SHAPE 1 type')
  console.log(type1)

  console.log('SHAPE 2 type')
  console.log(type2)

  if (type1 === 'Sprite' && type2 === 'Sprite') {
    const boundsA = shape1.getBounds()
    const boundsB = shape2.getBounds()
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)
  }

  if (
    (type1 === 'Sprite' || type1 === 'Rectangle' || type1 === 'rexImageBox') &&
    (type2 === 'Sprite' || type2 === 'Rectangle' || type1 === 'rexImageBox')
  ) {
    console.log('two rectangles go')

    return Phaser.Geom.Intersects.RectangleToRectangle(shape1 as any, shape2 as any)
  }

  if (
    (type1 === 'Circle' || type1 === 'Arc') &&
    (type2 === 'Circle' || type2 === 'Arc')
  ) {
    return Phaser.Geom.Intersects.CircleToCircle(shape1 as any, shape2 as any)
  }

  if (
    (type1 === 'Circle' || type1 === 'Arc') &&
    (type2 === 'Sprite' || type2 === 'Rectangle' || type1 === 'rexImageBox')
  ) {
    const upscaledRectangle = createUpscaledRectangle(shape2, shape1)

    return Phaser.Geom.Intersects.CircleToRectangle(shape1 as any, upscaledRectangle)
  }

  console.log('shape 1:')
  console.log(shape1)
  console.log('shape 2:')
  console.log(shape2)

  // this doesn't really work, container has zero x and y
  if (
    (type1 === 'Rectangle') &&
    (type2 === 'Container')
  ) {
    const draggedContainer: Container = shape2
    const onScreenGraphics: Rectangle = shape1

    /*
    const graphics = new Phaser.Geom.Rectangle(
      onScreenGraphics.x,
      onScreenGraphics.y,
      onScreenGraphics.w,
      onScreenGraphics.get
      , y2, w2, h2);


    const x2 = draggedContainer.x;
    const y2 = draggedContainer.y;
    const w2 = draggedContainer.width;
    const h2 = draggedContainer.height;
    const containerRectangular = new Phaser.Geom.Rectangle(x2, y2, w2, h2);

     */

    const draggedContainerBounds = draggedContainer.getBounds()

    console.log('CONTAINER')
    console.log(JSON.stringify(draggedContainerBounds))

    console.log('GRAPHICS')
    console.log(JSON.stringify(onScreenGraphics))

    return Phaser.Geom.Intersects.RectangleToRectangle(onScreenGraphics, draggedContainerBounds)
  }

  if (
    (type1 === 'Sprite' || type1 === 'Rectangle' || type1 === 'rexImageBox') &&
    (type2 === 'Circle' || type2 === 'Arc')
  ) {
    const upscaledRectangle = createUpscaledRectangle(shape1, shape2)

    return Phaser.Geom.Intersects.CircleToRectangle(shape2 as any, upscaledRectangle)
  }

  return false
}
