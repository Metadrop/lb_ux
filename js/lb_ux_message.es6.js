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
          const id = messages.add(message, { priority: type, type, index });
          drupalSettings.lbUX.messageDisplay.push({
            text: message,
            type,
            id
          });
        });

        const messagesWrapper = document.querySelector(".messages__wrapper");
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

  /**
   * Theme function for a message.
   *
   * @param {object} message
   *   The message object.
   * @param {string} message.text
   *   The message text.
   * @param {object} options
   *   The message context.
   * @param {string} options.type
   *   The message type.
   * @param {string} options.id
   *   ID of the message, for reference.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.message = ({ text }, { type, id, index = 0 }) => {
    const messagesTypes = Drupal.Message.getMessageTypeLabels();
    const messageWrapper = document.createElement("div");
    const messageClose = document.createElement("button");

    messageWrapper.setAttribute(
      "class",
      `messages messages--${type} messages__hidden messages__closeable`
    );
    messageWrapper.setAttribute(
      "role",
      type === "error" || type === "warning" ? "alert" : "status"
    );
    messageWrapper.setAttribute("id", id);
    messageWrapper.style.setProperty("--animation-index", index);
    messageWrapper.setAttribute("data-drupal-message-id", id);
    messageWrapper.setAttribute("data-drupal-message-type", type);

    messageWrapper.setAttribute("aria-label", messagesTypes[type]);

    messageWrapper.innerHTML = `${text}`;

    messageClose.innerHTML = '<span class="visually-hidden">Close</span>';
    messageClose.setAttribute("data-drupal-message-id", id);
    messageClose.classList.add("drupal-message-close");
    messageWrapper.appendChild(messageClose);

    return messageWrapper;
  };
})(jQuery, Drupal, drupalSettings);
