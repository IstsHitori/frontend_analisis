import { useState, useRef, useEffect } from 'react';
import { MathfieldElement } from 'mathlive';
import "mathlive";

export const useMathfield = () => {
    const [value, setValue] = useState('x^3-x-2');
    const mathFieldRef = useRef<MathfieldElement | null>(null);

    useEffect(() => {
        if (mathFieldRef.current) {

            mathFieldRef.current.smartFence = true;
            mathFieldRef.current.focus();

            const handleInput = (evt: any) => {
                setValue(mathFieldRef.current?.getValue() || '');
                evt.preventDefault();
                evt.stopPropagation();
                if (evt.inputType === 'insertLineBreak') {
                    evt.target.executeCommand('plonk');
                }
            };

            mathFieldRef.current.addEventListener('input', handleInput);

            return () => {
                mathFieldRef.current?.removeEventListener('input', handleInput);
            };
        }
    }, []);

    useEffect(() => {
        if (mathFieldRef.current) {
            mathFieldRef.current.value = value;
        }
	}, [value]);

    const renderMathField = () => (
        <math-field onInput={(evt) => setValue(evt.target.value)} ref={mathFieldRef}>{value}</math-field>
    );

    return { value, setValue, mathFieldRef, renderMathField };
};
