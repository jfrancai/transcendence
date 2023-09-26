import { createMachine } from 'xstate';

export const machine = createMachine(
  {
    context: {
      '': ''
    },
    id: 'chatMachine',
    initial: 'closed',
    states: {
      closed: {
        description: 'The channel component is closed.',
        on: {
          OPEN: {
            target: '#chatMachine.opened.HistoryView'
          }
        }
      },
      opened: {
        description: 'The channel component is opened.',
        initial: 'messageView',
        states: {
          messageView: {
            description: 'The chat component displays the contact view.',
            initial: 'defaultView',
            states: {
              defaultView: {
                on: {
                  clickOnPrivateMessage: {
                    target: 'conversationView'
                  },
                  clickOnChannel: {
                    target: 'conversationView'
                  }
                }
              },
              conversationView: {
                on: {
                  clickOnHeader: {
                    target: 'defaultView'
                  }
                }
              }
            },
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnProfile: {
                target: 'profileView'
              },
              clickOnContact: {
                target: 'contactView'
              }
            }
          },
          notificationView: {
            description: 'The chat component displays the notification view.',
            on: {
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnProfile: {
                target: 'profileView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              clickOnContact: {
                target: 'contactView'
              }
            }
          },
          searchView: {
            description: 'The chat component displays the search view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnProfile: {
                target: 'profileView'
              },
              clickOnMessage: {
                target: 'messageView'
              },
              clickOnContact: {
                target: 'contactView'
              }
            }
          },
          profileView: {
            description: 'The chat component displays the profile view.',
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
              clickOnContact: {
                target: 'contactView'
              }
            }
          },
          contactView: {
            description: 'The chat component displays the contact view.',
            on: {
              clickOnNotification: {
                target: 'notificationView'
              },
              clickOnSearch: {
                target: 'searchView'
              },
              clickOnProfile: {
                target: 'profileView'
              },
              clickOnMessage: {
                target: 'messageView'
              }
            }
          },
          HistoryView: {
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
        | { type: 'clickOnSearch' }
        | { type: 'clickOnMessage' }
        | { type: 'clickOnProfile' }
        | { type: 'clickOnNotification' }
        | { type: 'clickOnPrivateMessage' }
        | { type: 'clickOnChannel' }
        | { type: 'clickOnHeader' }
        | { type: 'clickOnContact' }
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
