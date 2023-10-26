import { createMachine } from 'xstate';
import { socket } from '../utils/functions/socket';

export const pongMachine = createMachine(
  {
    id: 'Pong Game',
    initial: 'Choosing Mode',
    states: {
      'Choosing Mode': {
        on: {
          CLASSIC_MODE: {
            target: 'Classic Mode Waiting Room',
            actions: ['joinClassicWaitingRoom', 'getInitialState']
          },
          SPEED_MODE: {
            target: 'Speed Mode Waiting Room',
            actions: ['joinSpeedWaitingRoom', 'getInitialState']
          }
        }
      },
      'Classic Mode Waiting Room': {
        on: {
          JOIN_PARTY_LOBBY: {
            target: 'Classic Mode Party Lobby'
          },
          CHANGE_MODE: {
            target: 'Choosing Mode',
            actions: ['leaveWaitingRoom']
          }
        }
      },
      'Speed Mode Waiting Room': {
        on: {
          JOIN_PARTY_LOBBY: {
            target: 'Speed Mode Party Lobby'
          },
          CHANGE_MODE: {
            target: 'Choosing Mode',
            actions: ['leaveWaitingRoom']
          }
        }
      },
      'Classic Mode Party Lobby': {
        initial: 'Not Ready',
        states: {
          'Not Ready': {
            on: {
              SET_READY: {
                target: 'Ready',
                actions: ['setReady']
              },
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              }
            }
          },
          Ready: {
            on: {
              START_MATCH: {
                target: 'Classic Mode Match'
              },
              SET_NOTREADY: {
                target: 'Not Ready',
                actions: ['setNotReady']
              },
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              }
            }
          },
          'Classic Mode Match': {
            on: {
              END_MATCH: {
                target: 'Classic Mode Match End'
              }
            }
          },
          'Classic Mode Match End': {
            on: {
              PLAY_AGAIN: {
                target: '#Pong Game.Classic Mode Waiting Room'
              },
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              }
            }
          }
        }
      },
      'Speed Mode Party Lobby': {
        initial: 'Not Ready',
        states: {
          'Not Ready': {
            on: {
              SET_READY: {
                target: 'Ready',
                actions: ['setReady']
              },
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              }
            }
          },
          Ready: {
            on: {
              START_MATCH: {
                target: 'Speed Mode Match'
              },
              SET_NOTREADY: {
                target: 'Not Ready',
                actions: ['setNotReady']
              },
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              }
            }
          },
          'Speed Mode Match': {
            on: {
              END_MATCH: {
                target: 'Speed Mode Match End'
              }
            }
          },
          'Speed Mode Match End': {
            on: {
              CHANGE_MODE: {
                target: '#Pong Game.Choosing Mode'
              },
              PLAY_AGAIN: {
                target: '#Pong Game.Speed Mode Waiting Room'
              }
            }
          }
        }
      }
    },
    schema: {
      events: {} as
        | { type: 'CLASSIC_MODE' }
        | { type: 'SPEED_MODE' }
        | { type: 'JOIN_PARTY_LOBBY' }
        | { type: 'SET_READY' }
        | { type: 'START_MATCH' }
        | { type: 'END_MATCH' }
        | { type: 'PLAY_AGAIN' }
        | { type: 'CHANGE_MODE' }
        | { type: 'SET_NOTREADY' }
        | { type: 'CHANGE_MODE' }
    },
    predictableActionArguments: true,
    preserveActionOrder: true
  },
  {
    actions: {
      joinClassicWaitingRoom: () => {
        socket.emit('joinClassicWaitingRoom');
      },
      joinSpeedWaitingRoom: () => {
        socket.emit('joinSpeedWaitingRoom');
      },
      getInitialState: () => {
        socket.emit('initialState');
      },
      leaveWaitingRoom: () => {
        socket.emit('leaveWaitingRoom');
      },
      setNotReady: () => {
        socket.emit('playerNotReady');
      },
      setReady: () => {
        socket.emit('playerReady');
      }
    },
    services: {},
    guards: {},
    delays: {}
  }
);
