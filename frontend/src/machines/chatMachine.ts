import { createMachine } from 'xstate';

export const chatMachine = createMachine(
  {
    context: {
      '': ''
    },
    id: 'chatMachine',
    initial: 'opened',
    states: {
      closed: {
        description: 'The channel component is closed',
        on: {
          OPEN: {
            target: '#chatMachine.opened.History State'
          }
        }
      },
      opened: {
        description: 'The channel component is open',
        initial: 'channelView',
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
                target: 'channeConversationView'
              },
              createChannel: {
                target: 'createChannelView'
              }
            }
          },
          createChannelView: {
            on: {
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnChannel: {
                target: 'channelView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              selectChannel: {
                target: 'channeConversationView'
              }
            }
          },
          channeConversationView: {
            on: {
              selectHeader: {
                target: 'channelView'
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
      }
    },
    schema: {
      events: {} as
        | { type: 'OPEN' }
        | { type: 'CLOSE' }
        | { type: 'selectHeader' }
        | { type: 'clickOnSearch' }
        | { type: 'selectChannel' }
        | { type: 'createChannel' }
        | { type: 'selectContact' }
        | { type: 'clickOnChannel' }
        | { type: 'clickOnMessage' }
        | { type: 'clickOnNotification' },
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
