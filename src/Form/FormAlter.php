<?php

namespace Drupal\lb_ux\Form;

use Drupal\Core\Ajax\AjaxHelperTrait;
use Drupal\Core\Form\FormStateInterface;

/**
 * Alters forms, delegated by hook_form_alter() implementations.
 */
class FormAlter {

  use AjaxHelperTrait;

  /**
   * Alters the section configuration form.
   *
   * @param array $form
   *   An associative array containing the structure of the form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current state of the form.
   */
  public function alterConfigureForm(array &$form, FormStateInterface $form_state) {
    // Allow the forms loaded into off-canvas to display status messages.
    if ($this->isAjax() && !isset($form['status_messages'])) {
      $form['status_messages'] = [
        '#type' => 'status_messages',
      ];
    }
  }

}
