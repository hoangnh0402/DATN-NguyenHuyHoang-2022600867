import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/SmartCity-Platform/markdown-page',
    component: ComponentCreator('/SmartCity-Platform/markdown-page', '2e0'),
    exact: true
  },
  {
    path: '/SmartCity-Platform/backend',
    component: ComponentCreator('/SmartCity-Platform/backend', '278'),
    routes: [
      {
        path: '/SmartCity-Platform/backend',
        component: ComponentCreator('/SmartCity-Platform/backend', 'fe1'),
        routes: [
          {
            path: '/SmartCity-Platform/backend',
            component: ComponentCreator('/SmartCity-Platform/backend', 'adc'),
            routes: [
              {
                path: '/SmartCity-Platform/backend/api-reference',
                component: ComponentCreator('/SmartCity-Platform/backend/api-reference', 'b88'),
                exact: true,
                sidebar: "backendSidebar"
              },
              {
                path: '/SmartCity-Platform/backend/configuration',
                component: ComponentCreator('/SmartCity-Platform/backend/configuration', 'e78'),
                exact: true,
                sidebar: "backendSidebar"
              },
              {
                path: '/SmartCity-Platform/backend/data-model',
                component: ComponentCreator('/SmartCity-Platform/backend/data-model', 'f7a'),
                exact: true,
                sidebar: "backendSidebar"
              },
              {
                path: '/SmartCity-Platform/backend/intro',
                component: ComponentCreator('/SmartCity-Platform/backend/intro', '79a'),
                exact: true,
                sidebar: "backendSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/SmartCity-Platform/frontend',
    component: ComponentCreator('/SmartCity-Platform/frontend', 'ef5'),
    routes: [
      {
        path: '/SmartCity-Platform/frontend',
        component: ComponentCreator('/SmartCity-Platform/frontend', '649'),
        routes: [
          {
            path: '/SmartCity-Platform/frontend',
            component: ComponentCreator('/SmartCity-Platform/frontend', 'a44'),
            routes: [
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/nuxt',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/nuxt', '561'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/nuxt-ui-icon',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/nuxt-ui-icon', '04b'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/pinia',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/pinia', 'd08'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/prettier',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/prettier', '078'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/tailwind',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/tailwind', 'c08'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/typescript',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/typescript', '891'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/vue',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/vue', 'af4'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/Công nghệ sử dụng/vueuse',
                component: ComponentCreator('/SmartCity-Platform/frontend/Công nghệ sử dụng/vueuse', 'e95'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/edge-storage-ui',
                component: ComponentCreator('/SmartCity-Platform/frontend/edge-storage-ui', '2fc'),
                exact: true,
                sidebar: "frontendSidebar"
              },
              {
                path: '/SmartCity-Platform/frontend/intro',
                component: ComponentCreator('/SmartCity-Platform/frontend/intro', 'f73'),
                exact: true,
                sidebar: "frontendSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/SmartCity-Platform/infrastructure',
    component: ComponentCreator('/SmartCity-Platform/infrastructure', 'd21'),
    routes: [
      {
        path: '/SmartCity-Platform/infrastructure',
        component: ComponentCreator('/SmartCity-Platform/infrastructure', '78c'),
        routes: [
          {
            path: '/SmartCity-Platform/infrastructure',
            component: ComponentCreator('/SmartCity-Platform/infrastructure', '98f'),
            routes: [
              {
                path: '/SmartCity-Platform/infrastructure/docker',
                component: ComponentCreator('/SmartCity-Platform/infrastructure/docker', '365'),
                exact: true,
                sidebar: "infraSidebar"
              },
              {
                path: '/SmartCity-Platform/infrastructure/intro',
                component: ComponentCreator('/SmartCity-Platform/infrastructure/intro', '194'),
                exact: true,
                sidebar: "infraSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/SmartCity-Platform/ml-ai',
    component: ComponentCreator('/SmartCity-Platform/ml-ai', '043'),
    routes: [
      {
        path: '/SmartCity-Platform/ml-ai',
        component: ComponentCreator('/SmartCity-Platform/ml-ai', 'a95'),
        routes: [
          {
            path: '/SmartCity-Platform/ml-ai',
            component: ComponentCreator('/SmartCity-Platform/ml-ai', 'f62'),
            routes: [
              {
                path: '/SmartCity-Platform/ml-ai/intro',
                component: ComponentCreator('/SmartCity-Platform/ml-ai/intro', 'fc7'),
                exact: true,
                sidebar: "mlAiSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/SmartCity-Platform/overview',
    component: ComponentCreator('/SmartCity-Platform/overview', '354'),
    routes: [
      {
        path: '/SmartCity-Platform/overview',
        component: ComponentCreator('/SmartCity-Platform/overview', 'fcc'),
        routes: [
          {
            path: '/SmartCity-Platform/overview',
            component: ComponentCreator('/SmartCity-Platform/overview', 'bdf'),
            routes: [
              {
                path: '/SmartCity-Platform/overview/architecture',
                component: ComponentCreator('/SmartCity-Platform/overview/architecture', 'a70'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/edge-storage-management',
                component: ComponentCreator('/SmartCity-Platform/overview/edge-storage-management', '710'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/functional-requirements',
                component: ComponentCreator('/SmartCity-Platform/overview/functional-requirements', '1b6'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/functions',
                component: ComponentCreator('/SmartCity-Platform/overview/functions', 'f3b'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/intro',
                component: ComponentCreator('/SmartCity-Platform/overview/intro', 'c9e'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/non-functional-requirements',
                component: ComponentCreator('/SmartCity-Platform/overview/non-functional-requirements', '94f'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/roadmap',
                component: ComponentCreator('/SmartCity-Platform/overview/roadmap', 'db3'),
                exact: true,
                sidebar: "overviewSidebar"
              },
              {
                path: '/SmartCity-Platform/overview/system-description',
                component: ComponentCreator('/SmartCity-Platform/overview/system-description', '73d'),
                exact: true,
                sidebar: "overviewSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/SmartCity-Platform/',
    component: ComponentCreator('/SmartCity-Platform/', '8c8'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
