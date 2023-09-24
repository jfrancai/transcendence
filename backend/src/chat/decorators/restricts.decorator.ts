import { Reflector } from '@nestjs/core';

export const Restrict = Reflector.createDecorator<('banned' | 'muted')[]>();
