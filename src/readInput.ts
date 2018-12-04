import fs from 'fs';
import _ from 'lodash';

function readInput(day: string): string[];
function readInput<T>(day: string, parseFunc: (line: string) => T): T[];

function readInput<T>(day: string, parseFunc?: (line: string) => T): string[] | T[] {
  const chain = _.chain(fs.readFileSync(`input/${day}`, "utf-8"))
    .trim()
    .split("\n")
  if (parseFunc) {
    return chain.map(parseFunc).value();
  }
  return chain.value();
}

export default readInput;