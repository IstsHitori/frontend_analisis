import { evaluate, parse } from "mathjs";

const getError = (
  maxD: number,
  Xr: number,
  oldXr: number,
  isPercentage: boolean = false
): number => {
  if (isPercentage) {
    return parseFloat(Math.abs(((Xr - oldXr) / Xr) * 100).toFixed(maxD));
  }

  return parseFloat(Math.abs((Xr - oldXr) / Xr).toFixed(maxD));
};

const gerXiPlusOne = (
  maxD: number,
  xi: number,
  fxi: number,
  ximinus1: number,
  fxiMinus1: number
): number => {
  const xiplusone = (fxi * ximinus1 - fxiMinus1 * xi) / (fxi - fxiMinus1);
  return parseFloat(xiplusone.toFixed(maxD));
};

export const secante = ({
  maxD,
  Xi,
  Xs,
  f,
  error,
  isPercentage = false,
  maxI = 50,
}: {
  maxD: number;
  Xi: number;
  Xs: number;
  f: string;
  error: string;
  isPercentage: boolean;
  maxI: number;
}): { rows: (number | string)[][]; fList: { f: string; label: string }[] } => {
  try {
    const fList: { f: string; label: string }[] = [];
    const err: number = parseFloat(error);
    let xi: number = parseFloat(Xi.toString());
    let ximinus1: number = parseFloat(Xs.toString());
    let fxi: number = parseFloat(evaluate(f, { x: xi }).toFixed(maxD));
    fList.push({
      f: `${parse(f).toTex({ x: xi })} = ${fxi}`,
      label: "f(X_i) = ",
    });
    let fxiMinus1: number = parseFloat(
      evaluate(f, { x: ximinus1 }).toFixed(maxD)
    );
    fList.push({
      f: `${parse(f).toTex({ x: ximinus1 })} = ${fxiMinus1}`,
      label: "f(X_i-1) = ",
    });
    let xiPlusOne: number = gerXiPlusOne(maxD, xi, fxi, ximinus1, fxiMinus1);
    fList.push({
      f: `${parse(
        `(${fxi}*${ximinus1}-${fxiMinus1}*${xi})/(${fxi}-${fxiMinus1})`
      ).toTex()} = ${xiPlusOne}`,
      label: "X_i+1 = ",
    });
    let errorXr: number = 1;
    let iterations: number = 1;
    const rows: (number | string)[][] = [];
    rows.push([iterations, xi, ximinus1, xiPlusOne, fxiMinus1, fxi, " "]);

    while (errorXr > err && iterations < maxI) {
      const oldXiPlusOne: number = xiPlusOne;
      xi = ximinus1;
      ximinus1 = xiPlusOne;
      fxi = fxiMinus1;

      fxiMinus1 = parseFloat(evaluate(f, { x: ximinus1 }).toFixed(maxD));
      fList.push({
        f: `${parse(f).toTex({ x: ximinus1 })} = ${fxiMinus1}`,
        label: "f(X_i-1) = ",
      });
      xiPlusOne = gerXiPlusOne(maxD, xi, fxi, ximinus1, fxiMinus1);
      fList.push({
        f: `${parse(
          `(${fxi}*${ximinus1}-${fxiMinus1}*${xi})/(${fxi}-${fxiMinus1})`
        ).toTex()} = ${xiPlusOne}`,
        label: "X_i+1 = ",
      });

      errorXr = getError(maxD, xiPlusOne, oldXiPlusOne, isPercentage);

      iterations++;
      rows.push([iterations, xi, ximinus1, xiPlusOne, fxiMinus1, fxi, errorXr]);
    }

    return {
      rows,
      fList,
    };
  } catch {
    return {
      rows: [],
      fList: [{ f: "", label: "" }],
    };
  }
};
