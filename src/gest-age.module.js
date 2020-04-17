import { gestAgePageScript } from './gest-age-page-script.mjs';

import dynamicImportPolyfill from 'dynamic-import-polyfill';

// This needs to be done before any dynamic imports are used.
// If your modules are hosted in a sub-directory, it must be specified here.
dynamicImportPolyfill.initialize({modulePath: '/dist'});

gestAgePageScript();
