import { Reflector } from '@nestjs/core';

// Empty channel is a channel with 0 or 1 user (creator of the channel)
export const ChannelIsNotEmpty = Reflector.createDecorator();
