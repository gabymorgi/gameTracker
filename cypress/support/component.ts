import React from "react";
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import "./hooks.ts";
import "./commands.ts";
import "./mountWithContext.tsx";
import "@cypress/code-coverage/support";

import { mount } from "cypress/react18";

// Augment the Cypress namespace to include type definitions for
// your custom command.
declare global {
  // Argument of type '"mount"' is not assignable to parameter of type 'keyof Chainable<any>'
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountWithContext: (children: React.ReactElement) => void;
    }
  }
}
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

Cypress.Commands.add("mount", mount);

// Example use:
// cy.mount(<MyComponent />)
