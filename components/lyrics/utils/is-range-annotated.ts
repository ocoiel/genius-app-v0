import { Annotation } from "..";

export const isRangeAnnotated = (
  annotations: Annotation[],
  startIndex: number,
  endIndex: number
): boolean => {
  return annotations.some(
    (annotation) =>
      (startIndex >= annotation.startIndex &&
        startIndex < annotation.endIndex) ||
      (endIndex > annotation.startIndex && endIndex <= annotation.endIndex) ||
      (startIndex <= annotation.startIndex && endIndex >= annotation.endIndex)
  );
};
