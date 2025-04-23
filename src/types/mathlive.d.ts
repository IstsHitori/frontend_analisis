/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
  interface IntrinsicElements {
    "math-field": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      ref?: React.RefObject<any>;
      output?: (evt: any) => void;
    };
  }
}
