import { Reflector } from '@nestjs/core';

// An empty channel is a channel with 0 or 1 user (creator of the channel)
export const EmptyChannel = Reflector.createDecorator();
