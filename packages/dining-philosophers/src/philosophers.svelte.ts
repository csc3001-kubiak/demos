
export class ChopStick {
  index: number;
  inUseBy: Philosopher | null = null ;

  constructor(index: number) {
    this.index = index;
  }

  grab(ph: Philosopher): ChopStick | null {
    if (!this.inUseBy) {
      this.inUseBy = ph;
      return this;
    } else {
      return null;
    }
  }

  acquire(ph: Philosopher, delay: number = 100): Promise<ChopStick> {
    return new Promise((resolve) => {
      if (this.grab(ph)) resolve(this);
      else {
        const spin = setInterval(
          () => {
            if (this.grab(ph)) {
              clearInterval(spin);
              resolve(this);
            }
          },
          delay
        );
      }
    });
  }

  release(): ChopStick | null {
    return (this.inUseBy = null);
  }
};

export interface Philosopher {
  index: number;
  left: ChopStick | null;
  right: ChopStick | null;
  isActive: boolean;

  isEating(): boolean;
  eat(): Promise<void>;
};

export interface DiningTable {
  chopsticks: ChopStick[];
  diners: Philosopher[];
}

export function setTable(guests: number = 5) : DiningTable {
  const chopsticks: ChopStick[] = Array.from(
    { length: guests },
    (_, i: number) => new ChopStick(i)
  );
  const diners: Philosopher[] = Array.from(
    { length: guests },
    (_, i: number) => new HungryPhilosopher(
      i, [
        chopsticks[i ? i - 1 : guests - 1],
        chopsticks[i]
      ]
    )
  );

  return {chopsticks, diners};
}

export function startAllEating(diners: Philosopher[]) {
  diners.forEach(
    (ph) => ph.eat()
  )
}

class HungryPhilosopher implements Philosopher {
  index: number;
  left: ChopStick | null = $state(null);
  right: ChopStick | null = $state(null);
  isActive = $state(false);

  sticks: ChopStick[];

  isEating(): boolean {
    return this.left !== null && this.right !== null;
  }

  constructor(index: number, sticks: ChopStick[]) {
    this.index = index;
    this.sticks = sticks;
  }

  async eat() {
    if (this.isActive) {
      console.log(`Philosopher ${this.index} is already eating!`);
      return;
    }
    this.isActive = true;
    while (true) {
      await this.sticks[0].acquire(this)
        .then((left) => {
          this.left = left;
          return this.sticks[1].acquire(this);
        })
        .then((right) => {
          this.right = right;
          console.log(`Philosopher ${this.index} has started eating`);
          return waitRandom(5000);
        })
        .then(() => {
          this.left = this.left?.release() || null;
          this.right = this.right?.release() || null;
          console.log(`Philosopher ${this.index} has finished eating`);
          return waitRandom(1000);
        });
    }
  }




}

function waitRandom(maxTime: number = 500): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(),
      Math.random() * maxTime
    )
  );
}
