import { type Entity, world } from '@equal/ecs';
import { point, rect } from '@equal/data-structures';
import type { Camera, Transform } from '../components';
import type { Query, SystemUpdate } from '@equal/ecs';

export const CameraSystemType = 'Camera';

export const CameraSystemQuery: Query = ['Transform', 'Camera'];

export const CameraSystemUpdate: SystemUpdate = (entities): void => {
  for (const entity of entities) {
    const [transform, camera] = getQueryComponents(entity);

    if (camera.follow === undefined) {
      continue;
    }

    const followTransform = world.getComponent<Transform>(camera.follow, 'Transform');

    if (followTransform === undefined) {
      continue;
    }

    transform.position = point(
      followTransform.position.x + followTransform.size.width / 2,
      followTransform.position.y + followTransform.size.height / 2,
    );

    camera.bounds = rect(
      transform.size.width / camera.zoom,
      transform.size.height / camera.zoom,
      transform.position.x - transform.size.width / camera.zoom / 2,
      transform.position.y - transform.size.height / camera.zoom / 2,
    );
  }
};

type GetQueryComponentsReturn = [Transform, Camera];

function getQueryComponents(entity: Entity): GetQueryComponentsReturn {
  return world.getComponents(entity, CameraSystemQuery as string[]) as GetQueryComponentsReturn;
}
