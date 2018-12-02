import fs from 'fs';
import _ from 'lodash';

export default (day: string) => 
  _.chain(fs.readFileSync(`input/${day}`, "utf-8"))
  .trim()
  .split("\n")
  .value();