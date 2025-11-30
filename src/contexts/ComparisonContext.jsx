import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ComparisonContext = createContext();

export const useComparison = () => {
    return useContext(ComparisonContext);
};

export const ComparisonProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            setCompareList(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (product) => {
        if (compareList.find(p => p.id === product.id)) {
            addToast('Product already in comparison list', 'info');
            return;
        }

        if (compareList.length >= 4) {
            addToast('You can compare up to 4 products only', 'warning');
            return;
        }

        setCompareList(prev => [...prev, product]);
        setIsOpen(true);
        addToast(`Added ${product.name} to compare`);
    };

    const removeFromCompare = (productId) => {
        setCompareList(prev => prev.filter(p => p.id !== productId));
    };

    const clearCompare = () => {
        setCompareList([]);
        setIsOpen(false);
    };

    const toggleCompare = () => {
        setIsOpen(prev => !prev);
    };

    const isInComparison = (productId) => {
        return compareList.some(p => p.id === productId);
    };

    const toggleComparison = (product) => {
        if (isInComparison(product.id)) {
            removeFromCompare(product.id);
        } else {
            addToCompare(product);
        }
    };

    return (
        <ComparisonContext.Provider value={{
            compareList,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isOpen,
            setIsOpen,
            toggleCompare,
            isInComparison,
            toggleComparison
        }}>
            {children}
        </ComparisonContext.Provider>
    );
};
