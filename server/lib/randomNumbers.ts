export class RandomNumbers {
  private static instance: RandomNumbers;

  private constructor() {}

  public static getInstance(): RandomNumbers {
    if (!RandomNumbers.instance) {
      RandomNumbers.instance = new RandomNumbers();
    }

    return RandomNumbers.instance;
  }

  public getRandomNumber(selectedNumbers: number[], limit?: number): number {
    if (selectedNumbers.length <= 0) return 0;

    const excludedNumbers = new Set(selectedNumbers);
    const availableNumbers = Array.from({ length: limit || 45 }).filter(
      (_, index) => !excludedNumbers.has(index)
    );

    if (availableNumbers.length <= 0) return 0;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);

    return randomIndex;
  }
}
