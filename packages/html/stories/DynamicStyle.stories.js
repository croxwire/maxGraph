import { Graph, utils, constants, RubberBandHandler } from '@maxgraph/core';

import { globalTypes } from '../.storybook/preview';

export default {
  title: 'Styles/DynamicStyle',
  argTypes: {
    ...globalTypes,
    rubberBand: {
      type: 'boolean',
      defaultValue: true,
    },
  },
};

const Template = ({ label, ...args }) => {
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.style.width = `${args.width}px`;
  container.style.height = `${args.height}px`;
  container.style.background = 'url(/images/grid.gif)';
  container.style.cursor = 'default';

  // Creates the graph inside the given container
  const graph = new Graph(container);

  // Disables moving of edge labels in this examples
  graph.edgeLabelsMovable = false;

  // Enables rubberband selection
  if (args.rubberBand) new RubberBandHandler(graph);

  // Needs to set a flag to check for dynamic style changes,
  // that is, changes to styles on cells where the style was
  // not explicitely changed using mxStyleChange
  graph.getView().updateStyle = true;

  // Overrides Cell.getStyle to return a specific style
  // for edges that reflects their target terminal (in this case
  // the strokeColor will be equal to the target's fillColor).

  const getStyle = function () {
    // TODO super cannot be used here
    // let style = super.getStyle();
    let style = {};

    if (this.isEdge()) {
      const target = this.getTerminal(false);

      if (target != null) {
        const targetStyle = graph.getCurrentCellStyle(target);
        const fill = utils.getValue(targetStyle, 'fillColor');

        if (fill != null) {
          style.strokeColor = fill;
        }
      }
    } else if (this.isVertex()) {
      const geometry = this.getGeometry();
      if (geometry != null && geometry.width > 80) {
        style.fillColor = 'green';
      }
    }
    return style;
  };

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  const parent = graph.getDefaultParent();

  // Adds cells to the model in a single step
  graph.batchUpdate(() => {
    const v1 = graph.insertVertex({
      parent,
      value: 'Hello,',
      position: [20, 20],
      size: [80, 30],
      style: { fillColor: 'green' },
    });
    v1.getStyle = getStyle;

    const v2 = graph.insertVertex({
      parent,
      value: 'World!',
      position: [200, 150],
      size: [80, 30],
      style: { fillColor: 'blue' },
    });
    v2.getStyle = getStyle;

    const v3 = graph.insertVertex({
      parent,
      value: 'World!',
      position: [20, 150],
      size: [80, 30],
      style: { fillColor: 'red' },
    });
    v3.getStyle = getStyle;

    const e1 = graph.insertEdge({
      parent,
      value: 'Connect',
      source: v1,
      target: v2,
      style: {
        perimeterSpacing: 4,
        strokeWidth: 4,
        labelBackgroundColor: 'white',
        fontStyle: 1,
      },
    });
    e1.getStyle = getStyle;
  });

  return container;
};

export const Default = Template.bind({});
