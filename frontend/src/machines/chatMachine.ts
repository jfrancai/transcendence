import { createMachine } from 'xstate';

export const chatMachine = createMachine(
  {
    context: {
      '': ''
    },
    id: 'chatMachine',
    initial: 'opened',
    states: {
      opened: {
        description: 'The channel component is open',
        initial: 'messageView',
        states: {
          messageView: {
            description: 'The chat component displays the contact view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              selectContact: {
                target: 'conversationView'
              },
              clickOnChannel: {
                target: 'channelView'
              }
            }
          },
          notificationView: {
            description: 'The chat component displays the notification view.',
            on: {
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          searchView: {
            description: 'The chat component displays the search view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          conversationView: {
            on: {
              selectHeader: {
                target: 'messageView'
              }
            }
          },
          channelView: {
            description: 'The chat component displays the contact view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              selectChannel: {
                target: 'channelSettings'
              },
              addChannel: {
                target: 'createORJoinChannelView'
              }
            }
          },
          channelSettings: {
            on: {
              clickOnChannel: {
                target: 'channelView'
              },
              selectContact: {
                target: 'conversationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          createORJoinChannelView: {
            on: {
              selectHeader: {
                target: 'channelView'
              },
              createChannel: {
                target: 'channelNameView'
              },
              joinChannel: {
                target: 'joinChannelView'
              }
            }
          },
          channelNameView: {
            on: {
              inviteChannel: {
                target: 'inviteChannelView'
              },
              selectHeader: {
                target: 'channelView'
              },
              previousAddChannel: {
                target: 'createORJoinChannelView'
              }
            }
          },
          joinChannelView: {
            on: {
              previousAddChannel: {
                target: 'createORJoinChannelView'
              },
              closeAddChannel: {
                target: 'channelView'
              }
            }
          },
          inviteChannelView: {
            on: {
              closeAddChannel: {
                target: 'channelView'
              },
              selectHeader: {
                target: 'channelView'
              },
              previousAddChannel: {
                target: 'channelNameView'
              }
            }
          },
          'History State': {
            history: 'shallow',
            type: 'history'
          }
        },
        on: {
          CLOSE: {
            target: 'closed'
          }
        }
      },
      closed: {
        description: 'The channel component is closed',
        on: {
          OPEN: {
            target: '#chatMachine.opened.History State'
          }
        }
      }
    },
    schema: {
      events: {} as
        | { type: 'selectHeader' }
        | { type: 'createChannel' }
        | { type: 'joinChannel' }
        | { type: 'clickOnNotification' }
        | { type: 'clickOnSearch' }
        | { type: 'clickOnMessage' }
        | { type: 'selectChannel' }
        | { type: 'addChannel' }
        | { type: 'inviteChannel' }
        | { type: 'previousAddChannel' }
        | { type: 'closeAddChannel' }
        | { type: 'clickOnChannel' }
        | { type: 'selectContact' }
        | { type: 'CLOSE' }
        | { type: 'OPEN' },
      context: {} as { '': string }
    },
    predictableActionArguments: true,
    preserveActionOrder: true
  },
  {
    actions: {},
    services: {},
    guards: {},
    delays: {}
  }
);
