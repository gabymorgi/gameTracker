import { useMemo, useRef } from 'react';
import isEqual from 'fast-deep-equal';

const useDeepCompareMemo = (factory: () => any, dependencies: Array<any>): any => {
  const previousDependenciesRef = useRef<Array<any>>([]);
  const memoizedValueRef = useRef<any>(null);

  const hasDependencyChanged = dependencies.some((dependency, index) => {
    return !isEqual(dependency, previousDependenciesRef.current[index]);
  });

  if (hasDependencyChanged) {
    memoizedValueRef.current = factory();
    previousDependenciesRef.current = dependencies;
  }

  return memoizedValueRef.current;
};

export default useDeepCompareMemo;