export interface RequestTransform {
  rewritePath: string;
  headers?: Record<string, string>;
}
