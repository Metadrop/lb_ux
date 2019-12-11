/**
 * @file
 * Provides Javascript for the Layout Builder UX module.
 */

(($, Drupal, drupalSettings) => {
  const selectors = {
    wrapper: {
      initial: "data-drupal-messages",
      active: "js-messages__wrapper"
    },
    message: {
      id: "data-drupal-message-id",
      active: "messages__closeable",
      button: "drupal-message-close"
    }
  };

  const lbMessage = {
    list: [],
    display: []
  };

  const initWrapper = () => {
    const { active, initial } = selectors.wrapper;
    const { button } = selectors.message;

    let wrapper = document.querySelector(`.${active}`);
    if (!wrapper) {
      wrapper = document.querySelector(`[${initial}]`);
      wrapper.classList.add(active);
    }

    if (!lbMessage.hasOwnProperty("message")) {
      lbMessage.message = new Drupal.Message(wrapper);
      wrapper.addEventListener("click", event => {
        if (event.target.classList.contains(button)) {
          const id = event.target.dataset.drupalMessageId;
          lbMessage.message.remove(id);
        }
      });
    }
  };

  const buttonClose = id => {
    const { id: idSelector, button: buttonSelector } = selectors.message;
    const button = document.createElement("button");
    button.innerHTML = `<span class="visually-hidden">${Drupal.t(
      "Close"
    )}</span>`;
    button.setAttribute(idSelector, id);
    button.classList.add(buttonSelector);

    return button;
  };

  const displayMessages = messageList => {
    initWrapper();
    // Filter list for already added messages and restructure object.
    const messageQueue = messageList.reduce((queue, list) => {
      Object.keys(list).forEach(type => {
        list[type]
          .filter(
            message =>
              !lbMessage.display.find(display => message === display.text)
          )
          .forEach(message => {
            queue.push({ message, type });
          });
      });
      return queue;
    }, []);

    // Add messages in the queue.
    messageQueue.forEach((item, index) => {
      const { message: messageText, type } = item;
      const { id: idSelector, active } = selectors.message;
      const id = lbMessage.message.add(messageText, {
        priority: type,
        type
      });

      const message = document.querySelector(`[${idSelector}=${id}]`);
      message.classList.add(active);
      message.style.setProperty("--animation-index", index);
      message.appendChild(buttonClose(id));

      lbMessage.display.push({
        text: messageText,
        type,
        id
      });
    });
  };

  /**
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.LbUXMessage = {
    attach: function() {
      if (drupalSettings.hasOwnProperty("lbUX")) {
        lbMessage.list = drupalSettings.lbUX.messageList;
      }

      displayMessages(lbMessage.list);
    }
  };
})(jQuery, Drupal, drupalSettings);
