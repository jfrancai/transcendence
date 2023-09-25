import { Reflector } from '@nestjs/core';

export type RolesType = 'creator' | 'admin' | 'member' | 'stranger';

export const Roles = Reflector.createDecorator<RolesType[]>();
