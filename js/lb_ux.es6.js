/**
 * @file
 * Provides Javascript for the Layout Builder UX module.
 */

(($, Drupal) => {

  /**
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.LbUX = {
    attach(context) {

      $('.layout-builder__actions .layout-builder__link').once().on('click', (event) => {
        $(event.currentTarget).parent().toggleClass('layout-builder__actions--display');
      });

      $(window).on('dialog:aftercreate', (event, dialog, $element) => {

      const id = $element
      .find('[data-layout-builder-target-highlight-id]')
      .attr('data-layout-builder-target-highlight-id');
    if (id) {
      $(`[data-layout-builder-highlight-id="${id}"]`).addClass(
        'layout-builder__block--selected',
      );
    }
  });

      $(window).on('dialog:afterclose', (event, dialog, $element) => {

        $('.layout-builder__block--selected').removeClass(
          'layout-builder__block--selected',
        );
        if (Drupal.offCanvas.isOffCanvas($element)) {
          console.log("test");
          // Remove the highlight from all elements.
          $('.layout-builder__actions--display').removeClass(
            'layout-builder__actions--display',
          );
        }
      });
    },
  };
})(jQuery, Drupal);
