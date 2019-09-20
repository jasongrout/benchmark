import { iter, JSToPhosphorIterator } from './iter';
import { runBenchmark } from './benchmark';
import { each, filter } from '@phosphor/algorithm';


function setup({ N }: { N: number } = { N: 1000 }) {
  let x = new Set<number>();
  let answer = 0;
  for (let i = 0; i < N; i++) {
    x.add(i);
    if (i % 2 === 0) {
      answer += i;
    }
  }
  return { x, answer };
}

let tests = [
  {
    name: 'iterable',
    fn: ({ x, answer }: ReturnType<typeof setup>) => {
      return () => {
        let sum = 0;
        [...x]
          .filter(i => i % 2 === 0)
          .forEach(i => {
            sum += i;
          });
        if (sum !== answer) {
          throw new Error('Wrong answer');
        }
      };
    }
  },
  {
    name: 'forEach',
    fn: ({ x, answer }: ReturnType<typeof setup>) => {
      return () => {
        let sum = 0;
        x.forEach((i: number) => {
          if (i % 2 === 0) {
            sum += i;
          }
        });
        if (sum !== answer) {
          throw new Error('Wrong answer');
        }
      };
    }
  },
  {
    name: 'Convenient Phosphor iterator',
    fn: ({ x, answer }: ReturnType<typeof setup>) => {
      return () => {
        let sum = 0;
        iter(x)
          .filter((i: any) => i % 2 === 0)
          .each((i: any) => {
            sum += i;
          });
        if (sum !== answer) {
          throw new Error('Wrong answer');
        }
      };
    }
  },
  {
    name: 'Straight Phosphor iterator',
    fn: ({ x, answer }: ReturnType<typeof setup>) => {
      return () => {
        let sum = 0;
        let it = new JSToPhosphorIterator(x);
        each(filter(it, (i: any) => i % 2 === 0), (i: any) => {
          sum += i;
        });
        if (sum !== answer) {
          throw new Error('Wrong answer');
        }
      };
    }
  }

];

(async function mybench() {
  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 1 }
  });
  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 2 }
  });
  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 3 }
  });
  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 4 }
  });

  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 5 }
  });
  await runBenchmark({
    setup,
    tests,
    options: { N: 10 ** 6 }
  });
})();
