import _ from 'lodash';
import readInput from './readInput';

type FightGroup = {
  id: string,
  unitCount: number,
  unitHp: number,
  typeMultiplier: _.Dictionary<number>,
  attack: number,
  attackType: string,
  initiative: number,
}

function parseInput(filename: string) {
  const lines = readInput(filename);
  const immuneSystem = {} as _.Dictionary<FightGroup>;
  const infection = {} as _.Dictionary<FightGroup>;
  let current = immuneSystem;
  _.forEach(lines, (line, idx) => {
    if (line === 'Immune System:') {
      current = immuneSystem;
    } else if (line === 'Infection:') {
      current = infection;
    } else if (_.trim(line) !== '') {
      const fg = parseLine(line, idx);
      current[fg.id] = fg;
    }
  })
  return {
    immuneSystem,
    infection,
  }
}

function parseLine(line: string, lineNumber: number): FightGroup {
  const matches = /(\d+) units each with (\d+) hit points( \(.*\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)/.exec(line);
  if (!matches) {
    console.log(line);
    throw 'BEEP BOOP';
  }
  const immunityMatch = /immune to ([^;)]+)/.exec(line);
  const weaknessMatch = /weak to ([^;)]+)/.exec(line);
  return {
    id: lineNumber.toString(),
    unitCount: parseInt(matches[1]),
    unitHp: parseInt(matches[2]),
    attack: parseInt(matches[4]),
    attackType: matches[5],
    initiative: parseInt(matches[6]),
    typeMultiplier: _.extend(
      _.chain(immunityMatch)
        .get(1)
        .split(',')
        .compact()
        .map(s => [_.trim(s), 0])
        .fromPairs()
        .value(),
      _.chain(weaknessMatch)
        .get(1)
        .split(',')
        .compact()
        .map(s => [_.trim(s), 2])
        .fromPairs()
        .value()),
  }
}

function effectivePower(fg: FightGroup): number {
  return fg.attack * fg.unitCount;
}

function damage(attacker: FightGroup, defender: FightGroup) {
  return effectivePower(attacker) * _.get(defender.typeMultiplier, attacker.attackType, 1);
}

function acquireTargets(attackers: _.Dictionary<FightGroup>, defenders: _.Dictionary<FightGroup>): _.Dictionary<string> {
  const untargettedDefenders = new Set(_.keys(defenders));
  const targets = {} as _.Dictionary<string>;
  _.chain(attackers)
    .values()
    .sortBy([effectivePower, (def: FightGroup) => def.initiative])
    .reverse()
    .forEach(atk => {
      const target = _.chain([...untargettedDefenders])
        .map((dId) => {
          const def = defenders[dId];
          if (!def) return;
          return {
            id: def.id,
            damageTaken: damage(atk, def),
            effectivePower: effectivePower(def),
            initiative: def.initiative,
          };
        })
        .compact()
        .filter(defData => defData.damageTaken > 0)
        .sortBy(['damageTaken', 'effectivePower', 'initiative'])
        .last()
        .value()
      if (target) {
        targets[atk.id] = target.id;
        untargettedDefenders.delete(target.id);
      }
    })
    .value();
  return targets;
}

function fightItOut(immuneSystem: _.Dictionary<FightGroup>, infection: _.Dictionary<FightGroup>) {
  let unitsKilled = Infinity;
  while (_.size(immuneSystem) > 0 && _.size(infection) > 0 && unitsKilled > 0) { 
    unitsKilled = 0;
    //immune system target selection;
    const targets = _.extend(
      acquireTargets(immuneSystem, infection),
      acquireTargets(infection, immuneSystem));

    //ATTACK
    _.chain(targets)
      .toPairs()
      .filter(([atkId, defId]) => !!defId)
      .map(([atkId, defId]) => ({
          atk: immuneSystem[atkId] || infection[atkId],
          def: immuneSystem[defId] || infection[defId]
      }))
      .sortBy(({atk}) => atk.initiative)
      .reverse()
      .forEach(({atk, def}) => {
        if (atk.unitCount === 0) {
          //alreadyDead
          return;
        }
        const killed = Math.floor(damage(atk, def)/def.unitHp);
        unitsKilled += killed;
        def.unitCount -= killed;
        if ((def.unitCount) <= 0) {
          def.unitCount = 0;
          _.unset(immuneSystem, def.id);
          _.unset(infection, def.id);
        }
      })
      .value();
  }
  return {
    immuneSystem,
    infection
  }
}

function part1(filename: string) {
  const {immuneSystem, infection} = parseInput(filename);
  const {immuneSystem: resImm, infection: resInf} = fightItOut(immuneSystem, infection);
  return _.chain(resImm)
    .extend(resInf)
    .values()
    .sumBy(fg => fg.unitCount)
    .value();
}

function simulateBoost(immuneSystem: _.Dictionary<FightGroup>, infection: _.Dictionary<FightGroup>, boost: number) {
  const tempImmune = _.cloneDeep(immuneSystem);
  const tempInfection = _.cloneDeep(infection);
  _.chain(tempImmune)
    .values()
    .forEach(val => {
      val.attack += boost;
    })
    .value();
  return fightItOut(tempImmune, tempInfection);
}

function part2(filename: string) {
  const {immuneSystem, infection} = parseInput(filename);
  const trials = [] as any[];
  let minBoost = 0;
  let maxBoost = 10000;
  while (minBoost !== maxBoost) {
    const boost = Math.floor((minBoost + maxBoost)/2)
    const results = simulateBoost(immuneSystem, infection, boost);
    trials.push({
      boost,
      immuneCount: _.chain(results.immuneSystem).values().map(fg=>fg.unitCount).sum().value(),
      infectCount: _.chain(results.infection).values().map(fg=>fg.unitCount).sum().value(),
    });
    if (_.size(results.immuneSystem) > 0 && _.size(results.infection) > 0) {
      minBoost += Math.ceil((minBoost + maxBoost)/2 - minBoost);
    } else if (_.size(results.immuneSystem) > 0) {
      maxBoost -= Math.ceil((minBoost + maxBoost)/2 - minBoost);
    } else {
      minBoost += Math.ceil((minBoost + maxBoost)/2 - minBoost);
    }
  }
  return _.chain(trials)
    .filter(trial => trial.infectCount === 0)
    .minBy(trial => trial.boost)
    .get('immuneCount')    
    .value() || -1;
}

describe('output', () => {
  test('part 1 ', () => {
    console.log(part1('day24'));
  })

  test('part 2 ', () => {
    console.log(part2('day24'));
  })
});