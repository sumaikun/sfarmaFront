import { rest } from 'prestashop-api-client';
 
export const prestashopClient = new rest.Client({
  language: 'en',
  languages: {
    'en': 1,
    'es': 2,
  },
  webservice: {
    key: 'ITEBHIEURLT922QIBK8WRYLXS589QDPV',
    scheme: 'https',
    host: 'ITEBHIEURLT922QIBK8WRYLXS589QDPV@sfarmadroguerias.com',
    root: '/api',
  },
});

