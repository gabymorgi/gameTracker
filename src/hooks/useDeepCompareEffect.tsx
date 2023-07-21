import { useEffect, useRef } from "react";
import isEqual from 'fast-deep-equal';

type EffectCallback = () => void | (() => void);

const useDeepCompareEffect = (effect: EffectCallback, dependencies: Array<any>): void => {
  const previousDependenciesRef = useRef<Array<any>>([]);

  const hasDependencyChanged = dependencies.some((dependency, index) => {
    return !isEqual(dependency, previousDependenciesRef.current[index]);
  });

  useEffect(() => {
    if (hasDependencyChanged) {
      previousDependenciesRef.current = dependencies;
      return effect();
    }
  }, [hasDependencyChanged, effect]);
};

export default useDeepCompareEffect;