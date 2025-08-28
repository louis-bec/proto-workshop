const React = require('react');
module.exports = {
  Button: (props) => React.createElement('button', props, props.children),
  Input: (props) => React.createElement('input', props),
  Card: (props) => React.createElement('div', props, props.children),
  Title3: (props) => React.createElement('h3', props, props.children),
  Title2: (props) => React.createElement('h2', props, props.children),
  Text: (props) => React.createElement('span', props, props.children),
  makeStyles: () => () => ({}),
  shorthands: { padding: () => ({}), margin: () => ({}) },
  FluentProvider: (props) => React.createElement('div', props, props.children),
  webLightTheme: {},
};
