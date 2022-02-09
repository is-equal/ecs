import { type Size, type Point } from '@equal/data-structures';
import { type Component, type TagComponent } from '@equal/ecs';

export interface Transform extends Component, Point, Size {}
export type DirtyPosition = TagComponent;
export type DirtyRenderer = TagComponent;
