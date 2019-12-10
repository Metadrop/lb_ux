/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.LbUXMessage = {
    attach: function attach() {
      var displayMessages = function displayMessages(messageList) {
        if (document.querySelector(".js-messages__wrapper")) {
          return;
        }
        var messagesWrapper = document.querySelector("[data-drupal-messages]");
        messagesWrapper.classList.add("js-messages__wrapper");
        var messages = new Drupal.Message(messagesWrapper);
        var messageQueue = messageList.reduce(function (queue, list) {
          Object.keys(list).forEach(function (type) {
            list[type].filter(function (message) {
              return !drupalSettings.lbUX.messageDisplay.find(function (display) {
                return message === display.text;
              });
            }).forEach(function (message) {
              queue.push({ message: message, type: type });
            });
          });
          return queue;
        }, []);

        messageQueue.forEach(function (item, index) {
          var message = item.message,
              type = item.type;

          var id = messages.add(message, { priority: type, type: type });
          var messageClose = document.createElement("button");
          messageClose.innerHTML = "<span class=\"visually-hidden\">" + Drupal.t("Close") + "</span>";
          messageClose.setAttribute("data-drupal-message-id", id);
          messageClose.classList.add("drupal-message-close");

          var messageWrapper = document.querySelector("[data-drupal-message-id=" + id + "]");
          messageWrapper.classList.add("messages__closeable");
          messageWrapper.style.setProperty("--animation-index", index);
          messageWrapper.appendChild(messageClose);

          drupalSettings.lbUX.messageDisplay.push({
            text: message,
            type: type,
            id: id
          });
        });

        messagesWrapper.addEventListener("click", function (event) {
          if (event.target.classList.contains("drupal-message-close")) {
            var id = event.target.dataset.drupalMessageId;
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