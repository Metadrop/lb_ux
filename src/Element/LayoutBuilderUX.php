<?php

namespace Drupal\lb_ux\Element;

use Drupal\Core\Render\Element;
use Drupal\Core\Url;
use Drupal\layout_builder\Element\LayoutBuilder;
use Drupal\layout_builder\SectionStorageInterface;

/**
 * @todo.
 */
class LayoutBuilderUX extends LayoutBuilder {

  /**
   * {@inheritdoc}
   */
  protected function buildAdministrativeSection(SectionStorageInterface $section_storage, $delta) {
    $build = parent::buildAdministrativeSection($section_storage, $delta);

    $section_label = $build['#attributes']['aria-label'];
    $build['actions'] = [
      '#type' => 'container',
      '#weight' => -100,
      '#attributes' => [
        'class' => [
          'layout-builder__actions',
          'layout-builder__actions__section',
        ],
      ],
      'label' => [
        '#type' => 'html_tag',
        '#tag' => 'span',
        '#attributes' => [
          'class' => ['layout-builder__section-label'],
        ],
        'content' => ['#markup' => $section_label],
      ],
      'configure' => $build['configure'],
      'remove' => $build['remove'],
    ];
    unset($build['configure'], $build['remove'], $build['section_label']);

    foreach (Element::children($build['layout-builder__section']) as $region) {
      foreach (Element::children($build['layout-builder__section'][$region]) as $uuid) {
        if (in_array($uuid, ['layout_builder_add_block', 'region_label'])) {
          continue 1;
        }

        $preview_fallback_string = $build['layout-builder__section'][$region][$uuid]['#attributes']['data-layout-content-preview-placeholder-label'];
        $route_parameters = $build['layout-builder__section'][$region][$uuid]['#contextual_links']['layout_builder_block']['route_parameters'];
        unset($build['layout-builder__section'][$region][$uuid]['#contextual_links']['layout_builder_block']);

        $build['layout-builder__section'][$region][$uuid] = [
          '#type' => 'container',
          '#attributes' => [
            'class' => [
              'js-layout-builder-block',
              'layout-builder-block',
            ],
            'data-layout-block-uuid' => $uuid,
            'data-layout-builder-highlight-id' => $this->blockUpdateHighlightId($uuid),
          ],
          'actions' => [
            '#type' => 'container',
            '#attributes' => [
              'class' => [
                'layout-builder__actions',
                'layout-builder__actions__block',
              ],
            ],
            'label' => [
              '#type' => 'html_tag',
              '#tag' => 'span',
              '#attributes' => [
                'class' => ['layout-builder__block-label'],
              ],
              'content' => ['#markup' => $preview_fallback_string],
            ],
            'move' => [
              '#type' => 'link',
              '#title' => $this->t('<span class="visually-hidden">Move @block</span>', ['@block' => $preview_fallback_string]),
              '#url' => Url::fromRoute('layout_builder.move_block_form', $route_parameters),
              '#attributes' => [
                'class' => [
                  'use-ajax',
                  'layout-builder__link',
                  'layout-builder__link--move',
                ],
                'data-dialog-type' => 'dialog',
                'data-dialog-renderer' => 'off_canvas',
              ],
            ],
            'configure' => [
              '#type' => 'link',
              '#title' => $this->t('<span class="visually-hidden">Configure @block</span>', ['@block' => $preview_fallback_string]),
              '#url' => Url::fromRoute('layout_builder.update_block', $route_parameters),
              '#attributes' => [
                'class' => [
                  'use-ajax',
                  'layout-builder__link',
                  'layout-builder__link--configure',
                ],
                'data-dialog-type' => 'dialog',
                'data-dialog-renderer' => 'off_canvas',
              ],
            ],
            'remove' => [
              '#type' => 'link',
              '#title' => $this->t('<span class="visually-hidden">Remove @block</span>', ['@block' => $preview_fallback_string]),
              '#url' => Url::fromRoute('layout_builder.remove_block', $route_parameters),
              '#attributes' => [
                'class' => [
                  'use-ajax',
                  'layout-builder__link',
                  'layout-builder__link--remove',
                ],
                'data-dialog-type' => 'dialog',
                'data-dialog-renderer' => 'off_canvas',
              ],
            ],
          ],
          'block' => $build['layout-builder__section'][$region][$uuid],
        ];
      }
    }
    return $build;
  }

  /**
   * {@inheritdoc}
   */
  protected function layout(SectionStorageInterface $section_storage) {
    $build = parent::layout($section_storage);
    $build['#attached']['library'][] = 'lb_ux/drupal.lb_ux';
    return $build;
  }

}
