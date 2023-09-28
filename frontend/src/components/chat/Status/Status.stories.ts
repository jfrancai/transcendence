import type { Meta, StoryObj } from '@storybook/react';
import Status from './Status';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Transcendence/Status',
  component: Status,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    severity: {
      name: 'type',
      type: { name: 'string', required: true },
      defaultValue: 'chat',
      description:
        'A component that print a headline for the categories inside the app',
      control: 'radio',
      options: ['ok', 'warn', 'err']
    }
  }
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {};
