import type { Meta, StoryObj } from '@storybook/react';

import Table  from './Table';
import { template } from '@babel/core';

const meta: Meta<typeof Table> = {
  title: 'Table',
  component: Table,
  argTypes: {
    backgroundColo : {control: 'color'},
    color : {control: 'color'},
    spacing: {control: {type: 'number'}},
    size: {control: {type: 'number'}},
    align: {control: {type: 'select'}, options: ['left', 'center', 'right']},
    // size
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const TableComponent: Story = {
};

