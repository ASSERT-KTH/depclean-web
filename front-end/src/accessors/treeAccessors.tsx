//get the size of a d3 node
export const sizeAccesor = (d: any) => d.size;
export const sizeAccesorMin = (d: any) => d.size;

export const midXAccessor = (d: any) => d.x0 + (d.x1 - d.x0) / 2;
export const midYAccessor = (d: any) => d.y0 + (d.y1 - d.y0) / 2;

//accessor to get the data
export const childrenAccessor = (d: any) => d.children;