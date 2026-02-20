interface GroupSmallFragmentsProps {
  id?: string;
  value?: string;
  threshold?: number;
  maxFragments?: number;
}

export default function groupSmallFragments(
  data: any[],
  {
    id = "Ticker",
    value = "weight",
    threshold = 3,
    maxFragments = 12,
  }: GroupSmallFragmentsProps = {}
) {
  if (!data?.length) return [];

  let newData = data
    .map((el) => ({
      [id]: el[id],
      [value]: Number(el[value]) || 0,
    }))
    .filter((el) => !isNaN(el[value] as number));

  newData = newData.sort((a, b) => (b[value] as number) - (a[value] as number));

  const other = { [id]: "Others", [value]: 0 };

  const weightsAreAllotedEqually = newData.every((el, i, arr) => {
    return i === 0 || el[value] === arr[i - 1][value];
  });

  // If all values are allocated equally and above the threshold
  if (weightsAreAllotedEqually && newData[0][value] > threshold) {
    return newData;
  }

  // If the highest value allocated is greater than threshold
  if (newData[0][value] > threshold) {
    // Group fragments that are below the threshold
    newData = newData.filter((d) => {
      if (d[value] < threshold) {
        other[value] += d[value];
        return false;
      }
      return true;
    });
  }

  // If there are still too many fragments, group the smallest ones
  if (newData.length > maxFragments) {
    const smallestFragments = newData.splice(maxFragments);
    const sumOfValues = smallestFragments.reduce(
      (acc, curr) => acc + curr[value],
      0
    );

    other[value] = (other[value] as number) + sumOfValues;
  }

  if ((other[value] as number) > 0) {
    newData.push(other);
  }

  return newData;
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}