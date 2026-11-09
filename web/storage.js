const key = 'asmr-v1';
export const samples = ['A busy school day', 'Too much homework', 'I need a quiet moment'];
export function load() {try {const x=JSON.parse(localStorage.getItem(key)); return x && typeof x==='object' ? x : {};} catch {return {};}}
export function save(data) {try {localStorage.setItem(key,JSON.stringify(data)); return true;} catch {return false;}}
export function clear() {try {localStorage.removeItem(key);return true;} catch {return false;}}
