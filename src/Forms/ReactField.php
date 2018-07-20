<?php

namespace Blueo\ReactField\Forms;

use SilverStripe\Forms\FormField;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\FieldType\DBField;

/**
 * Field to demonstrate react usage with cms field
 */
class ReactField extends FormField
{
    /**
     * @var string
     */
    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_TEXT;

    /**
     * Field name needs to match react component
     *
     * @var string
     */
    protected $schemaComponent = 'ReactField';

    /**
     * @param array $properties
     * @return void
     */
    public function Field($properties = [])
    {
        // Include react bootstrapper
        Requirements::javascript('blueo/silverstripe-reactfield:client/dist/js/entwine.js');

        return parent::Field($properties);
    }

    /**
     * Attributes for input, used to create react props by bootstrapper
     *
     * @return array
     */
    public function getAttributes()
    {
        $attributes = [
            'class' => $this->extraClass(),
            'type' => 'text',
            'id' => $this->ID(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state' => json_encode($this->getSchemaState()),
        ];

        $attributes = array_merge($attributes, $this->attributes);

        $this->extend('updateAttributes', $attributes);

        return $attributes;
    }

    /**
     * Provide props for react component
     *
     * @return array
     */
    public function getSchemaDataDefaults()
    {
        $defaults = parent::getSchemaDataDefaults();

        return $defaults;
    }

    /**
     * Return field value for template or schema
     * must return data than can be JSON encoded
     *
     * @return string|array|int|null
     */
    private function getFieldValue()
    {
        $value = $this->value;
        if ($this->value instanceof DBField) {
            $value = $this->value->getValue();
        }
        return $value;
    }

    /**
     * Get value for insertion into template
     *
     * @codeCoverageIgnore
     * @return string
     */
    public function getTemplateValue(): string
    {
        $value = $this->getFieldValue();
        return json_encode($value);
    }
}
