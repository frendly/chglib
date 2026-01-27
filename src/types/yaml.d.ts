declare module '*.yml' {
  interface HolidayEvent {
    startDate: string;
    endDate: string;
    text?: string;
    image: string;
  }

  const value: HolidayEvent[] | Record<string, unknown>;
  export default value;
}
