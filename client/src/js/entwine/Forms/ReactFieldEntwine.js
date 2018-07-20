import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

const FieldName = 'ReactField';

/**
 * Shiv for inserting react field into entwine forms
 * Based on TreeDropdownField
 * NB, your component should be registered with injector, @see boot/registerComponents.js
 *
 * @TODO validate the need for the afterformsubmission
 * Also @see LeftAndMain.KeyValueField.js for reloading behaviour after form submission
 */
$.entwine('ss', ($) => {
  $(`.js-injector-boot .${FieldName}`).entwine({
    Timer: null,
    Component: null,
    Value: null,

    onmatch: function() {
      this._super();

      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      // get component from Injector
      const Field = loadComponent(FieldName, context);
      this.setComponent(Field);

      const state = this.data('state') || {};
      this.setValue(state.value ? state.value : {});

      this.refresh();
    },

    onunmatch() {
      this._super();
      // solves errors given by ReactDOM "no matched root found" error.
      const container = this[0];
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    },

    refresh() {
      const props = this.getAttributes();
      const form = $(this).closest('form');

      const onChange = (value) => {
        this.setValue(value);

        this.refresh();
        // Trigger change detection (see jquery.changetracker.js)
        clearTimeout(this.getTimer());
        const timer = setTimeout(() => {
          form.trigger('change');
        }, 0);
        this.setTimer(timer);
      };

      const Field = this.getComponent();

      ReactDOM.render(
        <Field
          {...props}
          onChange={onChange}
          value={this.getValue()}
          noHolder
        />,
        this[0],
      );
    },

    /**
     * Find the selected node and get attributes associated to attach
     * the data to the component props
     *
     * @returns {Object}
     */
    getAttributes() {
      const state = $(this).data('state');
      const schema = $(this).data('schema');
      return schemaMerge(schema, state);
    }
  });
});
