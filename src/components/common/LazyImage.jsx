import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
    onLoad,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const [imageRef, setImageRef] = useState();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        let observer;

        if (imageRef && imageSrc === placeholderSrc) {
            observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setIsInView(true);
                            observer.unobserve(imageRef);
                        }
                    });
                },
                {
                    rootMargin: '50px' // Start loading 50px before image enters viewport
                }
            );
            observer.observe(imageRef);
        }

        return () => {
            if (observer && imageRef) {
                observer.unobserve(imageRef);
            }
        };
    }, [imageRef, imageSrc, placeholderSrc]);

    useEffect(() => {
        if (isInView && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
                if (onLoad) onLoad();
            };
        }
    }, [isInView, src, onLoad]);

    return (
        <img
            ref={setImageRef}
            src={imageSrc}
            alt={alt}
            className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'
                } ${className}`}
            {...props}
        />
    );
};

export default LazyImage;
