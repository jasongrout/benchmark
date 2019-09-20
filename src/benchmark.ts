import * as Benchmark from 'benchmark';
import { PromiseDelegate } from '@phosphor/coreutils';

export interface Tests<U> {
  name: string;
  fn: (x: U) => (() => void)
}

export async function runBenchmark<T, U>(options: {
  options?: T;
  setup: (options: T | undefined) => U;
  tests: Tests<U>[];
}): Promise<void> {
  let done = new PromiseDelegate<void>();
  let suite = new Benchmark.Suite();
  let args = options.setup(options.options);
  options.tests.forEach(({ name, fn }) => {
    suite.add(name, fn(args));
  });
  // add listeners
  suite
    .on('start', () => {
      console.log(`Starting run with arguments ${JSON.stringify(options.options)}`);
    })
    .on('cycle', function(event: any) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log(
        `Fastest is ${suite.filter('fastest').map((i: any) => i.name)}`
      );
      done.resolve();
    })
    // run async
    .run({ async: true });
  return done.promise;
}
