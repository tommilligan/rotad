import { Dayjs } from "dayjs";

export function toRFC3339(datetime: Dayjs): string {
  return datetime.format("YYYY-MM-DDTHH:mm:ssZ");
}

export function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
