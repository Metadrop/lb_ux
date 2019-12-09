/**
 * @file
 * Provides Javascript for the Layout Builder UX module.
 */

(($, Drupal, drupalSettings) => {
  /**
   * Override Drupal.Message.defaultWrapper() because it sets the wrapper to an
   * existing message in some themes.
   *
   *  @return {HTMLElement}
   *   The default destination for JavaScript messages.
   *
   */
  Drupal.Message.defaultWrapper = () => {
    let wrapper = document.querySelector('[data-drupal-messages]');
    if (!wrapper) {
      wrapper = document.querySelector('[data-drupal-messages-fallback]');
      wrapper.removeAttribute('data-drupal-messages-fallback');
      wrapper.setAttribute('data-drupal-messages', '');
      wrapper.classList.remove('hidden');
    }
    const inner = wrapper.querySelector('.messages__wrapper');
    return inner || wrapper;
    // return wrapper;
  };

  /**
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.LbUXMessage = {
    attach: function() {
      const displayMessages = messageList => {
        const messages = new Drupal.Message();
        const messageQueue = messageList.reduce((queue, list) => {
          Object.keys(list).forEach(type => {
            list[type]
              .filter(
                message =>
                  (!drupalSettings.lbUX.messageDisplay.find(
                    display => message === display.text
                  ))
              )
              .forEach(message => {
                queue.push({ message, type });
              });
          });
          return queue;
        }, []);

        messageQueue.forEach((item, index) => {
          const { message, type } = item;
          const id = messages.add(message, { priority: type, type });
          const messageClose = document.createElement("button");
          const messageWrapper = document.querySelector(
            `[data-drupal-message-id=${id}]`
          );

          messageClose.innerHTML = '<span class="visually-hidden">Close</span>';
          messageClose.setAttribute("data-drupal-message-id", id);
          messageClose.classList.add("drupal-message-close");
          messageWrapper.classList.add("messages__closeable");
          messageWrapper.style.setProperty("--animation-index", index);
          messageWrapper.appendChild(messageClose);

          drupalSettings.lbUX.messageDisplay.push({
            text: message,
            type,
            id
          });
        });

        const messagesWrapper = document.querySelector("[data-drupal-messages]");
        messagesWrapper.classList.add("js-messages__wrapper");
        messagesWrapper.addEventListener("click", event => {
          if (event.target.classList.contains("drupal-message-close")) {
            const id = event.target.dataset.drupalMessageId;
            messages.remove(id);
          }
        });
      };

      if (drupalSettings.hasOwnProperty("lbUX")) {
        if (!drupalSettings.lbUX.hasOwnProperty("messageDisplay")) {
          drupalSettings.lbUX.messageDisplay = [];
        }
        displayMessages(drupalSettings.lbUX.messageList);
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
