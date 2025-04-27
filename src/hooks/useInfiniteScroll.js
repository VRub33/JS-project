import { useEffect, useRef, useState } from 'react';

export const useInfiniteScroll = (loadMore, isLoading, hasMore) => {
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const options = {
      root: null,
      rootMargin: "100px",  // Отступ перед тем, как начнется подгрузка
      threshold: 0.5,       // Подгрузка будет происходить, когда 50% элемента будет в зоне видимости
    };

    const callback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        loadMore(); // Вызываем подгрузку данных
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);
    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observerRef.current.observe(currentLoader);
    }

    return () => {
      if (observerRef.current && currentLoader) {
        observerRef.current.unobserve(currentLoader); // Очищаем наблюдатель
      }
    };
  }, [isLoading, hasMore, loadMore]);

  return loaderRef;
};
