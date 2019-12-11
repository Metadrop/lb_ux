/**
 * @file
 * Provides Javascript for the Layout Builder UX module.
 */

(($, Drupal, drupalSettings) => {
  /**
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.LbUXMessage = {
    attach: function() {
      const initWrapper = () => {
        let wrapper = document.querySelector(".js-messages__wrapper");
        if (!wrapper) {
          wrapper = document.querySelector("[data-drupal-messages]");
          wrapper.classList.add("js-messages__wrapper");
        }

        if (drupalSettings.lbUX) {
          if (!drupalSettings.lbUX.hasOwnProperty("messages")) {
            drupalSettings.lbUX.messages = new Drupal.Message(wrapper);
            wrapper.addEventListener("click", event => {
              if (event.target.classList.contains("drupal-message-close")) {
                const id = event.target.dataset.drupalMessageId;
                drupalSettings.lbUX.messages.remove(id);
              }
            });
          }
        }

        return wrapper;
      };

      const displayMessages = messageList => {
        const messagesWrapper = initWrapper();
        if (!messagesWrapper || !(drupalSettings.lbUX || {}).messages) {
          return;
        }
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
          const id = drupalSettings.lbUX.messages.add(message, {
            priority: type,
            type
          });
          const messageClose = document.createElement("button");
          messageClose.innerHTML = `<span class="visually-hidden">${Drupal.t(
            "Close"
          )}</span>`;
          messageClose.setAttribute("data-drupal-message-id", id);
          messageClose.classList.add("drupal-message-close");

          const messageWrapper = document.querySelector(
            `[data-drupal-message-id=${id}]`
          );
          messageWrapper.classList.add("messages__closeable");
          messageWrapper.style.setProperty("--animation-index", index);
          messageWrapper.appendChild(messageClose);

          drupalSettings.lbUX.messageDisplay.push({
            text: message,
            type,
            id
          });
        });
      };

      if (drupalSettings.hasOwnProperty("lbUX")) {
        // Add a variable for listing displayed messages.
        if (!drupalSettings.lbUX.hasOwnProperty("messageDisplay")) {
          drupalSettings.lbUX.messageDisplay = [];
        }
      }

      const { messageList = [] } = drupalSettings.lbUX || {};
      displayMessages(messageList);
    }
  };
})(jQuery, Drupal, drupalSettings);
