const actions = {
  bold: {
    icon: '<b class="text-black-60">B</b>',
    title: 'Bold',
    result: () => exec('bold')
  },
  italic: {
    icon: '<i class="text-black-60">I</i>',
    title: 'Italic',
    result: () => exec('italic')
  },
  underline: {
    icon: '<u class="text-black-60">U</u>',
    title: 'Underline',
    result: () => exec('underline')
  },
  strikethrough: {
    icon: '<strike class="text-black-60">S</strike>',
    title: 'Strike-through',
    result: () => exec('strikeThrough')
  }
};

const classes = {
  actionbar: 'pell-actionbar',
  button: 'pell-button',
  content: 'pell-content'
};

export const exec = (command, value = null) => {
  document.execCommand(command, false, value);
};

const preventTab = event => {
  if (event.which === 9) { event.preventDefault(); }
};

export const init = settings => {
  settings.actions = settings.actions
    ? settings.actions.map(action => {
      if (typeof action === 'string') { return actions[action]; }
      else if (actions[action.name]) { return { ...actions[action.name], ...action }; }
      return action;
    })
    : Object.keys(actions).map(action => actions[action]);

  settings.classes = { ...classes, ...settings.classes };

  const actionbar = document.createElement('div');
  actionbar.className = settings.classes.actionbar;
  settings.element.appendChild(actionbar);

  settings.element.content = document.createElement('div');
  settings.element.content.contentEditable = true;
  settings.element.content.className = settings.classes.content;
  settings.element.content.oninput = event => settings.onChange(event.target.innerHTML);
  settings.element.content.onkeydown = preventTab;
  settings.element.appendChild(settings.element.content);

  settings.actions.forEach(action => {
    const button = document.createElement('button');
    button.className = settings.classes.button;
    button.innerHTML = action.icon;
    button.title = action.title;
    button.onclick = action.result;
    actionbar.appendChild(button);
  });

  if (settings.defaultParagraphSeparator) exec('defaultParagraphSeparator', settings.defaultParagraphSeparator)
  if (settings.styleWithCSS) { exec('styleWithCSS'); }


  return settings.element;
};

export default { exec, init };
