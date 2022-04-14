import { readFileSync } from 'fs';
import { Namespace } from 'api-elements';

const ns = new Namespace();

export function readRefractFile(path) {
    const url = new URL(path, import.meta.url);
    const text = readFileSync(url, { encoding: 'utf-8'});
    const json = JSON.parse(text);
    return ns.serialiser.deserialise(json);
}

export function readFile(path) {
    const url = new URL(path, import.meta.url);
    return readFileSync(url, { encoding: 'utf-8'});
}
  
  