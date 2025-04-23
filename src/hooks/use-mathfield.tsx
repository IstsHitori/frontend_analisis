/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { MathfieldElement } from "mathlive";
import "mathlive";

export const useMathfield = () => {
  const [value, setValue] = useState("x^3-x-2");
  const mathFieldRef = useRef<MathfieldElement | null>(null);

  useEffect(() => {
    if (mathFieldRef.current) {
      const mathField = mathFieldRef.current;
      mathField.smartFence = true;
      mathField.focus();

      const handleInput = (evt: any) => {
        setValue(mathField.getValue() || "");
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.inputType === "insertLineBreak") {
          evt.target.executeCommand("plonk");
        }
      };

      mathField.addEventListener("input", handleInput);

      return () => {
        mathField.removeEventListener("input", handleInput);
      };
    }
  }, []);

  useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.value = value;
    }
  }, [value]);

  const renderMathField = () => (
    <div>
      {/* @ts-ignore */}
      <math-field
        onInput={(evt: any) => setValue(evt.target.value)}
        ref={mathFieldRef}
      >
        {value}
        {/* @ts-ignore */}
      </math-field>
    </div>
  );

  return { value, setValue, mathFieldRef, renderMathField };
};
