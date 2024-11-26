// Helper function to calculate the UTC offset based on the selected timezone
export const getUTCOffsetForTimeZone = (timeZone: string) => {
    const timeZoneOffsets = {
      PST: -8,
      EST: -5,
      GMT: 0,
      IST: 5.5, // IST is UTC+5:30
    };
    return timeZoneOffsets[timeZone as keyof object] || 0; // Default to GMT if timezone is not found
  };