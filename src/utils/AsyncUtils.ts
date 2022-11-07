import { CollectionChain } from "lodash";

export async function asyncFlatMap<T, O>(arr: T[], asyncFn: (t: T) => Promise<O[]>): Promise<O[]> {
    return Promise.all(flatten(await asyncMap(arr, asyncFn)))
}

export function flatMap<T, O>(arr: T[], fn: (t: T) => O[]): O[] {
    return flatten(arr.map(fn))
}

export function asyncMap<T, O>(arr: T[], asyncFn: (t: T) => Promise<O>): Promise<O[]> {
    return Promise.all(arr.map(asyncFn))
}

export function flatten<T>(arr: T[][]): T[] {
    return ([] as T[]).concat(...arr);
}

// export function asyncReduce<T, O>(arr: T[], asyncFn: (t: T) => Promise<CollectionChain<O>>): Promise<CollectionChain<O>> {
//     return Promise.all(arr.map(asyncFn))
// }