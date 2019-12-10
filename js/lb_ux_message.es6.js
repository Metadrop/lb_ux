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
        if (document.querySelector(".js-messages__wrapper")) {
          return;
        }
        const messagesWrapper = document.querySelector(
          "[data-drupal-messages]"
        );
        messagesWrapper.classList.add("js-messages__wrapper");
        const messages = new Drupal.Message(messagesWrapper);
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
