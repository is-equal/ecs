import type { Component } from '@equal/ecs';
import type { Point, Size } from '@equal/data-structures';

export interface BoxCollider2D extends Component, Point, Size {}
