import { useCallback, useRef } from 'react';
import isEqual from 'fast-deep-equal';

const useDeepCompareCallback = (callback: (...args: any[]) => any, dependencies: Array<any>): ((...args: any[]) => any) => {
  const previousDependenciesRef = useRef<Array<any>>([]);
  const callbackRef = useRef<any>(null);

  const hasDependencyChanged = dependencies.some((dependency, index) => {
    return !isEqual(dependency, previousDependenciesRef.current[index]);
  });

  if (hasDependencyChanged) {
    callbackRef.current = callback;
    previousDependenciesRef.current = dependencies;
  }

  return useCallback((...args: any[]) => callbackRef.current(...args), []);
};

export default useDeepCompareCallback;