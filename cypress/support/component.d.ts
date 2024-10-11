// Importa la función `mount` que estás usando
import { mount } from "cypress/react18";

// Augmenta la interfaz Chainable de Cypress para incluir tu custom command
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Exporta algo para que el archivo sea considerado un módulo
export {};
