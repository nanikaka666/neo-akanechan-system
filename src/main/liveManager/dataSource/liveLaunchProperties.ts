import { LiveLaunchProperties } from "../../../types/liveLaunchProperties";

export class LiveLaunchPropertiesDataContainer {
  readonly #liveLaunchProperties: LiveLaunchProperties;
  constructor(liveLaunchProperties: LiveLaunchProperties) {
    this.#liveLaunchProperties = liveLaunchProperties;
  }
  get() {
    return this.#liveLaunchProperties;
  }
}
