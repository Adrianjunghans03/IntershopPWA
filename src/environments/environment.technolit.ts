import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'TECHNOLIT-TECHNOLIT_DE-Site',

  themeColor: '#688dc3',

  features: [
    ...ENVIRONMENT_DEFAULTS.features,
    'businessCustomerRegistration',
    'costCenters',
    'maps',
    'punchout',
    'quickorder',
    'quoting',
    'orderTemplates',
  ],

  ...overrides,
};
