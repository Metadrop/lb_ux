<?php

namespace Drupal\lb_ux\Plugin\Block;

use Drupal\Core\Form\FormStateInterface;
use Drupal\layout_builder\Plugin\Block\InlineBlock;

/**
 * Alters the inline block form.
 */
class InlineBlockUX extends InlineBlock {

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);
    // Hide the label field when the label display is unchecked.
    $form['label']['#states']['invisible'][':input[name="settings[label_display]"]']['checked'] = FALSE;
    if ($this->isNew) {
      // Uncheck the label display checkbox for new blocks.
      $form['label_display']['#default_value'] = FALSE;
      // Prefill the label field for new blocks.
      $form['label']['#default_value'] = $this->getMachineNameSuggestion();
    }
    return $form;
  }

}
