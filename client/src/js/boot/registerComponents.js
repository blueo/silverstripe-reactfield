import Injector from 'lib/Injector';
import ReactField from '../components/ReactField/ReactField';

const registerComponents = () => {
  /** Register react components here
   * Register fields here to make them available to the silverstripe injector
   *
   * eg:
   * Injector.component.register('ReactField', ReactField);
  */
  Injector.component.register('ReactField', ReactField);
};

export default registerComponents;
